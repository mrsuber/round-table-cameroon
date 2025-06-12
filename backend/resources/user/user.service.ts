import { Request } from 'express'
import { UploadedFile } from 'express-fileupload'

import { User, UserModel } from '@/resources/user'
import { ProjectModel } from '@/resources/project'
import { FileModel } from '@/resources/file'
import { GeneralSettingsModel, NotificationSettingsModel } from '@/resources/user/settings'
import {
    FILE_STRUCTURE,
    ROLES,
    STATUS_CODES,
    API_HOST,
    UPLOADS_SHORT_URL,
    PAGINATION
} from '@/utils/helper/constants'
import { saveFile, deleteElementInArray } from '@/utils/helper/utils'
import { paginationResult } from '@/utils/definitions/custom'
import HttpException from '@/utils/exceptions/http.exception'

class UserService {
    /**
     * Get user's complete profile
     */
    public async getUser(req: Request): Promise<object | Error> {
        try {
            const user = await UserModel.findOne({ _id: req.user._id, isDeleted: false })
                .select('-password -isUser -isMember -isDeleted')
                .populate({
                    path: 'profileImage',
                    select: {
                        deleted: 0
                    }
                })
                .populate('managedProjects')
                .populate('projects')
                .populate('generalSettings')
                .populate('notificationSettings')
                .exec() as User
            if (!user) {
                throw new HttpException(
                    STATUS_CODES.ERROR.NOT_FOUND,
                    'User not found'
                )
            }
            if (user.profileImage) {
                user.profileImage.dirPath = undefined as unknown as string
                user.profileImage.httpPath = API_HOST + UPLOADS_SHORT_URL + String(user.profileImage._id) + '.' + user.profileImage.httpPath
            }
            return user
        } catch (error: any) {
            throw new HttpException(
                error.status || STATUS_CODES.ERROR.SERVER_ERROR,
                error.message || 'Server error'
            )
        }
    }

    public async activateUsers(): Promise<void | Error> {
        try {
            const files = await FileModel
                .find()
                .exec()

            for (let i = 0; i < files.length; i++) {
                let file = files[i]
                await FileModel.findByIdAndUpdate(file._id, {
                    deleted: false,
                })
            }

        } catch (error: any) {
            throw new HttpException(
                error.status || STATUS_CODES.ERROR.SERVER_ERROR,
                error.message || 'Server error'
            )
        }
    }


    /**
     * Upload profile image
     */
    public async uploadProfileImage(
        req: Request
    ): Promise<void | Error> {
        try {
            const file = req.files?.image as UploadedFile
            if (!file) {
                throw new HttpException(
                    STATUS_CODES.ERROR.BAD_REQUEST,
                    'No image uploaded'
                )
            }
            let userId = req.user._id
            let arr = file.name.split('.')
            // Extension of image
            let ext = arr[arr.length - 1]
            const filePath = saveFile(FILE_STRUCTURE.USER_PROFILE_DIR, file)
            const fileId = req.user.profileImage

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
            await UserModel.findByIdAndUpdate(userId, {
                profileImage: newFile._id,
            })
        } catch (error: any) {
            throw new HttpException(
                error.status || STATUS_CODES.ERROR.SERVER_ERROR,
                error.message || 'Server error'
            )
        }
    }

    /**
     * Update general settings
     */
    public async updateGeneralSettings(
        req: Request
    ): Promise<void | Error> {
        try {
            const { region, language, timezone, twelveHourFormat } = req.body
            if (req.user.generalSettings) {
                await GeneralSettingsModel.findByIdAndUpdate(req.user.generalSettings, {
                    region,
                    language,
                    timezone,
                    twelveHourFormat,
                })
            } else {
                let generalSettings = await new GeneralSettingsModel({
                    region,
                    language,
                    timezone,
                    twelveHourFormat,
                }).save()
                await UserModel.findByIdAndUpdate(req.user._id, {
                    generalSettings
                })
            }
        } catch (error: any) {
            throw new HttpException(
                error.status || STATUS_CODES.ERROR.SERVER_ERROR,
                error.message || 'Server error'
            )
        }
    }

    /**
     * Update notification settings
     */
    public async updateNotificationSettings(
        req: Request
    ): Promise<void | Error> {
        try {
            const { dailyNewsletter, message, projectUpdate, projectDeadline } = req.body
            if (req.user.notificationSettings) {
                await NotificationSettingsModel.findByIdAndUpdate(req.user.notificationSettings, {
                    dailyNewsletter,
                    message,
                    projectUpdate,
                    projectDeadline,
                })
            } else {
                let notificationSettings = await new NotificationSettingsModel({
                    dailyNewsletter,
                    message,
                    projectUpdate,
                    projectDeadline,
                }).save()
                await UserModel.findByIdAndUpdate(req.user._id, {
                    notificationSettings
                })
            }
        } catch (error: any) {
            throw new HttpException(
                error.status || STATUS_CODES.ERROR.SERVER_ERROR,
                error.message || 'Server error'
            )
        }
    }

    /**
     * Approve user to become member
     */
    public async approveMember(req: Request): Promise<void | Error> {
        try {
            const { email } = req.body
            const user = await UserModel.findOne({
                email, isDeleted: false
            })

            if (!user) {
                throw new HttpException(
                    STATUS_CODES.ERROR.NOT_FOUND,
                    'User not found'
                )
            }

            if (user.isMember) {
                throw new HttpException(
                    STATUS_CODES.ERROR.BAD_REQUEST,
                    'User has already been approved'
                )
            }

            // Make sure account is verified before allowing approval
            if (!user.isUser) {
                throw new HttpException(
                    STATUS_CODES.ERROR.BAD_REQUEST,
                    'User has not been verified'
                )
            } else {
                await UserModel.findByIdAndUpdate(user._id, {
                    $set: {
                        isMember: true,
                        role: ROLES.MEMBER,
                    },
                })
            }
        } catch (error: any) {
            throw new HttpException(
                error.status || STATUS_CODES.ERROR.SERVER_ERROR,
                error.message || 'Server error'
            )
        }
    }

    public async makeAdmin(req: Request): Promise<void | Error> {
        try {
            const { email } = req.body
            const user = await UserModel.findOne({
                email, isDeleted: false
            })

            if (!user) {
                throw new HttpException(
                    STATUS_CODES.ERROR.NOT_FOUND,
                    'User not found'
                )
            }
            await UserModel.findByIdAndUpdate(user._id, {
                $set: {
                    role: ROLES.SUPER_ADMIN,
                },
            })
        } catch (error: any) {
            throw new HttpException(
                error.status || STATUS_CODES.ERROR.SERVER_ERROR,
                error.message || 'Server error'
            )
        }
    }

    /**
     * Get members
     */
    public async getMembers(
        req: Request,
        searchParams: {}
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
            result.total = await UserModel
                .find({ ...searchParams })
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

            result.data = await UserModel
                .find({ ...searchParams }, '-password -isDeleted')
                .sort('createdAt')
                .skip(startIndex)
                .limit(pageLimit)
                .populate({
                    path: 'profileImage',
                    select: {
                        deleted: 0
                    }
                })
                .exec()

            result.rowsPerPage = pageLimit

            for (let i = 0; i < result.data.length; i++) {
                let user = result.data[i]
                user.description = user.description ? user.description : null
                user.numberOfProjects = user.projects.length + user.managedProjects.length
                if (user.profileImage) {
                    user.profileImage.dirPath = undefined as unknown as string
                    user.profileImage.httpPath = API_HOST + UPLOADS_SHORT_URL + String(user.profileImage._id) + '.' + user.profileImage.httpPath
                }
            }

            return result
        } catch (error: any) {
            throw new HttpException(
                error.status || STATUS_CODES.ERROR.SERVER_ERROR,
                error.message || 'Server error'
            )
        }
    }

    /**
     * Update profile details
     */
    public async updateProfile(req: Request): Promise<void | Error> {
        try {
            const user = req.user
            const {
                firstName,
                lastName,
                about,
                linkedIn,
                facebook,
                twitter,
                username,
                profession,
                town,
                gender,
            } = req.body

            await UserModel.findByIdAndUpdate(user._id, {
                firstName,
                lastName,
                about,
                linkedIn,
                facebook,
                twitter,
                username,
                profession,
                town,
                gender,
            })
        } catch (error: any) {
            throw new HttpException(
                error.status || STATUS_CODES.ERROR.SERVER_ERROR,
                error.message || 'Server error'
            )
        }
    }

    /**
     * Delete user account
     */
    public async deleteAccount(req: Request): Promise<void | Error> {
        try {
            const user = req.user
            this.deleteAccountHelper(user)
        } catch (error: any) {
            throw new HttpException(
                error.status || STATUS_CODES.ERROR.SERVER_ERROR,
                error.message || 'Server error'
            )
        }
    }

    public async deleteUserAccount(req: Request): Promise<void | Error> {
        console.log(req.params.userId)
        const user = await UserModel.findOne({ _id: req.params.userId, isDeleted: false }).exec()
        if (!user) {
            throw new HttpException(STATUS_CODES.ERROR.NOT_FOUND, 'User not found')
        }
        if (user.role === ROLES.SUPER_ADMIN) {
            throw new HttpException(STATUS_CODES.ERROR.FORBIDDEN, "Cannot delete super admin's account")
        }
        try {
            this.deleteAccountHelper(user)
        } catch (error: any) {
            throw new HttpException(
                error.status || STATUS_CODES.ERROR.SERVER_ERROR,
                error.message || 'Server error'
            )
        }
    }

    private async deleteAccountHelper(user: User): Promise<void | Error> {
        const projects = user.projects
        const managedProjects = user.managedProjects
        for (let i = 0; i < projects.length; i++) {
            let project = await ProjectModel.findById(projects[i]).exec()
            if (project) {
                let contributors = project.contributors
                deleteElementInArray(String(user._id), contributors)
                await ProjectModel.findByIdAndUpdate(project._id, {
                    contributors,
                })
            }
        }
        for (let i = 0; i < managedProjects.length; i++) {
            let managedProject = await ProjectModel.findById(managedProjects[i]).exec()
            if (managedProject) {
                let projectManager = managedProject.projectManager
                deleteElementInArray(String(user._id), projectManager)
                await ProjectModel.findByIdAndUpdate(managedProject._id, {
                    projectManager,
                })
            }
        }
        await UserModel.findByIdAndUpdate(user._id, {
            isDeleted: true
        })
    }
}

export default UserService
