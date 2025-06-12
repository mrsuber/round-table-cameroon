import { UploadedFile } from 'express-fileupload'
import { Request } from 'express'

import {
    Partner,
    FormModel,
    PartnerModel,
    SubscriberModel,
} from '@/resources/contact'
import { FileModel } from '@/resources/file'
import { paginationResult } from '@/utils/definitions/custom'
import {
    FILE_STRUCTURE,
    STATUS_CODES,
    PAGINATION,
    API_HOST,
    UPLOADS_SHORT_URL
} from '@/utils/helper/constants'
import { getPaginatedData, saveFile } from '@/utils/helper/utils'
import HttpException from '@/utils/exceptions/http.exception'

class ContactService {
    /**
     * Create new form
     */
    public async createForm(
        req: Request,
    ): Promise<void | Error> {
        try {
            const { fullNames, email, message } = req.body
            await new FormModel({
                fullNames,
                email,
                message,
            }).save()
        } catch (error: any) {
            throw new HttpException(
                error.status || STATUS_CODES.ERROR.SERVER_ERROR,
                error.message || 'Server error'
            )
        }
    }

    /**
     * Get created forms
     */
    public async getForms(
        req: Request
    ): Promise<paginationResult | Error> {
        try {
            const pageNumber =
                parseInt(req.query.pageNumber as string) ||
                PAGINATION.DEFAULT_PAGE_NUMBER
            const pageLimit =
                parseInt(req.query.limit as string) ||
                PAGINATION.DEFAULT_PAGE_LIMIT
            const result = (await getPaginatedData(
                pageNumber,
                pageLimit,
                FormModel,
                {},
                '',
                'createdAt'
            )) as paginationResult

            return result
        } catch (error: any) {
            throw new HttpException(
                error.status || STATUS_CODES.ERROR.SERVER_ERROR,
                error.message || 'Server error'
            )
        }
    }

    /**
     * Add new partner
     */
    public async addPartner(
        req: Request
    ): Promise<void | Error> {
        try {
            const { name, moreInfo } = req.body
            let partner = await PartnerModel.findOne({
                name,
            }).exec()
            if (partner) {
                throw new HttpException(
                    STATUS_CODES.ERROR.CONFLICT,
                    'Failed! There is already a partner with this name!'
                )
            }
            new PartnerModel({
                name,
                moreInfo,
            }).save()
        } catch (error: any) {
            throw new HttpException(
                error.status || STATUS_CODES.ERROR.SERVER_ERROR,
                error.message || 'Server error'
            )
        }
    }

    /**
     * Get partners
     */
    public async getPartners(
        req: Request
    ): Promise<paginationResult | Error> {
        try {
            const pageNumber =
                parseInt(req.query.pageNumber as string) ||
                PAGINATION.DEFAULT_PAGE_NUMBER
            const pageLimit =
                parseInt(req.query.limit as string) ||
                PAGINATION.DEFAULT_PAGE_LIMIT
            const startIndex = pageNumber * pageLimit
            const endIndex = (pageNumber + 1) * pageLimit

            const result: paginationResult = {
                total: 0,
                data: [],
                rowsPerPage: 0,
            }
            result.total = await PartnerModel
                .countDocuments()
                .exec()

            // Check if previous page exists and give page number
            if (startIndex > 0) {
                result.previous = {
                    pageNumber: pageNumber - 1,
                    pageLimit,
                }
            }

            // Check if next page exists and give page number
            if (endIndex < result.total) {
                result.next = {
                    pageNumber: pageNumber + 1,
                    pageLimit,
                }
            }

            result.data = await PartnerModel
                .find()
                .sort('name')
                .skip(startIndex)
                .limit(pageLimit)
                .populate({
                    path: 'logo',
                    select: {
                        deleted: 0
                    }
                })
                .exec()

            result.rowsPerPage = pageLimit
            let data = []

            for (let i = 0; i < result.data.length; i++) {
                let partner = result.data[i]
                if (partner.logo) {
                    partner.logo.dirPath = undefined as unknown as string
                    partner.logo.httpPath = API_HOST + UPLOADS_SHORT_URL + String(partner.logo._id) + '.' + partner.logo.httpPath
                }
                data.push(partner)
            }
            result.data = result.data.map((partner: Partner) => {
                return {
                    id: partner._id,
                    name: partner.name,
                    moreInfo: partner.moreInfo,
                    logo: partner.logo
                        ? API_HOST + '/api/uploads/' + partner.logo
                        : null,
                }
            })

            result.data = data

            return result
        } catch (error: any) {
            throw new HttpException(
                error.status || STATUS_CODES.ERROR.SERVER_ERROR,
                error.message || 'Server error'
            )
        }
    }

    /**
     * Update partner logo
     */
    public async uploadPartnerLogo(
        req: Request
    ): Promise<void | Error> {
        try {
            const { partnerId } = req.body
            const userId = req.user._id
            if (req.files) {
                const file = req.files.image as UploadedFile
                const partner = await PartnerModel.findById(partnerId).exec()
                if (!partner) {
                    throw new HttpException(
                        STATUS_CODES.ERROR.NOT_FOUND,
                        'Partner not found'
                    )
                }

                let arr = file.name.split('.')
                // Extension of image
                const ext = arr[arr.length - 1]
                const filePath = saveFile(
                    FILE_STRUCTURE.PARTNER_LOGO_DIR,
                    file
                )

                const fileId = partner.logo
                if (fileId) {
                    await FileModel.findByIdAndUpdate(fileId, { deleted: true })
                }
                let newFile = await new FileModel({
                    httpPath: ext,
                    dirPath: filePath,
                    name: file.name,
                    size: file.size,
                    mimetype: file.mimetype,
                    uploadedBy: userId
                }).save()
                await PartnerModel.findByIdAndUpdate(partnerId, {
                    logo: newFile._id,
                })

            } else {
                throw new HttpException(
                    STATUS_CODES.ERROR.BAD_REQUEST,
                    'Upload failed, no image found'
                )
            }
        } catch (error: any) {
            throw new HttpException(
                error.status || STATUS_CODES.ERROR.SERVER_ERROR,
                error.message || 'Server error'
            )
        }
    }

    /**
     * Subscribe function
     */
    public async subscribe(req: Request): Promise<void | Error> {
        try {
            const { email } = req.body
            const subscriber = await SubscriberModel.findOne({ email })
            if (subscriber) {
                throw new HttpException(
                    STATUS_CODES.ERROR.CONFLICT,
                    'Already subscribed'
                )
            }
            new SubscriberModel({
                email,
            }).save()
        } catch (error: any) {
            throw new HttpException(
                error.status || STATUS_CODES.ERROR.SERVER_ERROR,
                error.message || 'Server error'
            )
        }
    }

    /**
     * Get subscribed emails
     */
    public async getSubscribers(
        req: Request
    ): Promise<paginationResult | Error> {
        try {
            const pageNumber =
                parseInt(req.query.pageNumber as string) ||
                PAGINATION.DEFAULT_PAGE_NUMBER
            const pageLimit =
                parseInt(req.query.limit as string) ||
                PAGINATION.DEFAULT_PAGE_LIMIT
            const result = (await getPaginatedData(
                pageNumber,
                pageLimit,
                SubscriberModel,
                {},
                'email',
                'createdAt'
            )) as paginationResult

            return result
        } catch (error: any) {
            throw new HttpException(
                error.status || STATUS_CODES.ERROR.SERVER_ERROR,
                error.message || 'Server error'
            )
        }
    }
}

export default ContactService
