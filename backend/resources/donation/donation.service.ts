import { Request } from 'express'
import axios from 'axios'

import {
    Donation,
    DonationModel,
    Transfer,
    TransferModel,
} from '@/resources/donation'
import { momoHeader, paginationResult } from '@/utils/definitions/custom'
import {
    STATUS_CODES,
    DONATION_STATE,
    PAGINATION,
    MOMO_SECRETS,
    API_HOST,
} from '@/utils/helper/constants'
import HttpException from '@/utils/exceptions/http.exception'

class DonationService {
    // MINUTES_BEFORE_REFRESH = 5
    // disbursementAccessToken = null as unknown as string
    // disbursementTokenRefereshTime = null as unknown as Date
    // collectionAccessToken = null as unknown as string
    // collectionTokenRefereshTime = null as unknown as Date
    /**
     * Create a new donation
     */
    public async initiateDonation(req: Request): Promise<Donation | Error> {
        try {
            const { purpose, description, amount, payerNumber, donatedBy } =
                req.body

            const donation = await new DonationModel({
                purpose,
                description,
                amount,
                payerNumber,
                donatedBy,
            }).save()
            let refillState = await this.requestFunds(donation)
            const newState =
                refillState === "Pending" ? DONATION_STATE.PENDING : DONATION_STATE.FAILED
            await DonationModel.findByIdAndUpdate(donation._id, {
                state: newState,
            }).then(() => {
                donation.state = newState
            })
            donation.isDeleted = undefined as unknown as boolean
            return donation
        } catch (error: any) {
            throw new HttpException(
                error.status || STATUS_CODES.ERROR.SERVER_ERROR,
                error.message || 'Server error'
            )
        }
    }

    // public async confirmPayment(req: Request): Promise<void | Error> {
    //     try {
    //         const { externalId, status } = req.body
    //         const newState =
    //             status === 'SUCCESSFUL'
    //                 ? DONATION_STATE.SUCCESSFUL
    //                 : DONATION_STATE.FAILED
    //         await DonationModel.findByIdAndUpdate(externalId, {
    //             state: newState,
    //         })
    //         if (status === 'SUCCESSFUL') {
    //             const donation = await DonationModel.findById(externalId).exec()
    //             if (donation) {
    //                 this.initiateTransfer(donation)
    //             }
    //         }
    //     } catch (error: any) {
    //         throw new HttpException(
    //             error.status || STATUS_CODES.ERROR.SERVER_ERROR,
    //             error.message || 'Server error'
    //         )
    //     }
    // }

    public async confirmTransfer(req: Request): Promise<void | Error> {
        try {
            const { externalId, status } = req.body
            const newState =
                status === 'SUCCESSFUL'
                    ? DONATION_STATE.SUCCESSFUL
                    : DONATION_STATE.FAILED
            await TransferModel.findByIdAndUpdate(externalId, {
                state: newState,
            })
        } catch (error: any) {
            throw new HttpException(
                error.status || STATUS_CODES.ERROR.SERVER_ERROR,
                error.message || 'Server error'
            )
        }
    }

    public async getDonations(req: Request): Promise<paginationResult | Error> {
        try {
            const pageNumber =
                parseInt(req.query.pageNumber as string) ||
                PAGINATION.DEFAULT_PAGE_NUMBER
            const pageLimit =
                parseInt(req.query.limit as string) ||
                PAGINATION.DEFAULT_PAGE_LIMIT
            let state = req.query.state
            if (
                state &&
                state != DONATION_STATE.PENDING &&
                state != DONATION_STATE.SUCCESSFUL &&
                state != DONATION_STATE.FAILED
            ) {
                throw new HttpException(
                    STATUS_CODES.ERROR.BAD_REQUEST,
                    `Invalid request query, state must be '${DONATION_STATE.PENDING}', '${DONATION_STATE.SUCCESSFUL}' or '${DONATION_STATE.FAILED}'`
                )
            }
            const startIndex = pageNumber * pageLimit
            const endIndex = (pageNumber + 1) * pageLimit

            const result: paginationResult = {
                total: 0,
                data: [],
                rowsPerPage: 0,
            }
            result.total = await DonationModel.find(state ? { state } : {})
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

            result.data = await DonationModel.find(
                state ? { state } : {},
                '-isDeleted'
            )
                .skip(startIndex)
                .limit(pageLimit)
                .exec()
            result.rowsPerPage = pageLimit
            // console.log(result)
            const token = await this.fetchToken()
            const headers = {
                'Authorization': `Bearer ${token}`,
            }

            const configHeaders = {
                headers,
            }

            const res = await axios.get(
                `${MOMO_SECRETS.VALLET_PAY_BASE_URL}/transaction`,
                configHeaders
            )
            const transactionData = res.data
            for (let i = 0; i < transactionData.length; i++) {
                result.data.push({
                    "donatedBy": "",
                    "amount": 0,
                    "purpose": transactionData[i].reason,
                    "engagedAmount": transactionData[i].amount,
                    "isTransaction": true,
                    "createdAt": convertDateTime(transactionData[i].date)
                })
            }
            sortByDate(result.data)
            return result
        } catch (error: any) {
            throw new HttpException(
                error.status || STATUS_CODES.ERROR.SERVER_ERROR,
                error.message || 'Server error'
            )
        }
    }

    public async getValletBalance(): Promise<number | Error> {
        try {
            const token = await this.fetchToken()
            const headers = {
                'Authorization': `Bearer ${token}`,
            }

            const configHeaders = {
                headers,
            }

            const res = await axios.get(
                `${MOMO_SECRETS.VALLET_PAY_BASE_URL}/transaction/wallet`,
                configHeaders
            )
            return Math.floor(res.data.balance)
        } catch (error: any) {
            console.log(error)
            throw new HttpException(
                error.status || STATUS_CODES.ERROR.SERVER_ERROR,
                error.message || 'Server error'
            )
        }
    }

    public async getDonationsBalance(req: Request): Promise<number | Error> {
        try {
            // const successfulDonations = await DonationModel.find(
            //     { state: DONATION_STATE.SUCCESSFUL },
            //     'amount'
            // )
            //     .exec()
            // const sum = successfulDonations.reduce((totalAmount, successfulDonation) => totalAmount + successfulDonation.amount, 0);
            req.query.state = DONATION_STATE.SUCCESSFUL
            req.query.limit = '1000'
            const data = await this.getDonations(req) as paginationResult;
            const donations = data.data;
            // console.log(donations)
            let balance = 0;
            for (let i = 0; i < donations.length; i++) {
                const donation = donations[i];
                if (donation.isTransaction) {
                    balance -= donation.engagedAmount
                } else {
                    balance += donation.amount
                }
            }
            return balance
        } catch (error: any) {
            console.log(error)
            throw new HttpException(
                error.status || STATUS_CODES.ERROR.SERVER_ERROR,
                error.message || 'Server error'
            )
        }
    }

    public async getTransfers(req: Request): Promise<paginationResult | Error> {
        try {
            const pageNumber =
                parseInt(req.query.pageNumber as string) ||
                PAGINATION.DEFAULT_PAGE_NUMBER
            const pageLimit =
                parseInt(req.query.limit as string) ||
                PAGINATION.DEFAULT_PAGE_LIMIT
            let state = req.query.state
            if (
                state &&
                state != DONATION_STATE.PENDING &&
                state != DONATION_STATE.SUCCESSFUL &&
                state != DONATION_STATE.FAILED
            ) {
                throw new HttpException(
                    STATUS_CODES.ERROR.BAD_REQUEST,
                    `Invalid request query, state must be '${DONATION_STATE.PENDING}', '${DONATION_STATE.SUCCESSFUL}' or '${DONATION_STATE.FAILED}'`
                )
            }
            const startIndex = pageNumber * pageLimit
            const endIndex = (pageNumber + 1) * pageLimit

            const result: paginationResult = {
                total: 0,
                data: [],
                rowsPerPage: 0,
            }
            result.total = await TransferModel.find(state ? { state } : {})
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

            result.data = await TransferModel.find(
                state ? { state } : {},
                '-isDeleted'
            )
                .skip(startIndex)
                .limit(pageLimit)
                .exec()
            result.rowsPerPage = pageLimit
            return result
        } catch (error: any) {
            throw new HttpException(
                error.status || STATUS_CODES.ERROR.SERVER_ERROR,
                error.message || 'Server error'
            )
        }
    }

    private async requestFunds(donation: Donation): Promise<string | Error> {
        try {
            const token = await this.fetchToken()
            const externalId = donation._id
            const amount = donation.amount
            const phoneNumber = `${donation.payerNumber}`
            const payerMessage = donation.purpose
            const callbackUrl = API_HOST + '/api/donations/confirm-withdrawal'
            const headers = {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                'Callback-Url': callbackUrl,
            }

            const configHeaders = {
                headers,
            }

            const data = {
                amount,
                externalId,
                "accountNumber": phoneNumber,
                payerMessage,
            }

            const res = await axios.post(
                `${MOMO_SECRETS.VALLET_PAY_BASE_URL}/transaction/v1/collect-funds`,
                data,
                configHeaders
            )
            return res.data.refillState
        } catch (err: any) {
            console.log(err)
            return err.response.status
        }
    }

    public async confirmWithdrawal(req: Request): Promise<void | Error> {
        try {
            const { externalId, status } = req.body

            await DonationModel.findByIdAndUpdate(externalId, { state: status })

            // if (status === 'SUCCESSFUL') {
            //     const donation = await DonationModel.findById(externalId).exec()
            //     if (donation) {
            //         this.initiateTransfer(donation)
            //     }
            // }
        } catch (error: any) {
            throw new HttpException(
                error.status || STATUS_CODES.ERROR.SERVER_ERROR,
                error.message || 'Server error'
            )
        }
    }

    public async deleteDonation(req: Request): Promise<void | Error> {
        try {
            const donationId = req.params.donationId
            const donation = await DonationModel.findById(donationId).exec()
            if (!donation) {
                throw new HttpException(
                    STATUS_CODES.ERROR.NOT_FOUND,
                    'Donation not found'
                )
            }
            await DonationModel.findByIdAndDelete(donation._id).exec()
        } catch (error: any) {
            throw new HttpException(
                error.status || STATUS_CODES.ERROR.SERVER_ERROR,
                error.message || 'Server error'
            )
        }
    }

    // private async updateTokenVars(
    //     isDisbursement: boolean
    // ): Promise<void | Error> {
    //     if (isDisbursement) {
    //         this.disbursementAccessToken = (await this.getAccessToken(
    //             true
    //         )) as string
    //         let decodedToken = JSON.parse(
    //             Buffer.from(
    //                 this.disbursementAccessToken.split('.')[1],
    //                 'base64'
    //             ).toString()
    //         )
    //         this.disbursementTokenRefereshTime = new Date(
    //             `${decodedToken.expires}z`
    //         )
    //         this.disbursementTokenRefereshTime.setMinutes(
    //             this.disbursementTokenRefereshTime.getMinutes() -
    //                 this.MINUTES_BEFORE_REFRESH
    //         )
    //     } else {
    //         this.collectionAccessToken = (await this.getAccessToken(
    //             isDisbursement
    //         )) as string
    //         let decodedToken = JSON.parse(
    //             Buffer.from(
    //                 this.collectionAccessToken.split('.')[1],
    //                 'base64'
    //             ).toString()
    //         )
    //         this.collectionTokenRefereshTime = new Date(
    //             `${decodedToken.expires}z`
    //         )
    //         this.collectionTokenRefereshTime.setMinutes(
    //             this.collectionTokenRefereshTime.getMinutes() -
    //                 this.MINUTES_BEFORE_REFRESH
    //         )
    //     }
    // }
    // public async initiateTransfer(donation: Donation): Promise<void | Error> {
    //     try {
    //         const amountWhenCommisionRemoved =
    //             (donation.amount * (100 - MOMO_SECRETS.PERCENTAGE_COMMISION)) /
    //             100
    //         const transfer = await new TransferModel({
    //             purpose: donation.purpose,
    //             amount: amountWhenCommisionRemoved,
    //             payeeNumber: MOMO_SECRETS.BENEFACTOR_MOMO_NUMBER,
    //             donatedBy: donation.donatedBy,
    //         }).save()
    //         let status = await this.transferFunds(transfer)
    //         const newState =
    //             status === 202 ? DONATION_STATE.PENDING : DONATION_STATE.FAILED
    //         await TransferModel.findByIdAndUpdate(transfer._id, {
    //             state: newState,
    //         }).then(() => {
    //             transfer.state = newState
    //         })
    //     } catch (error: any) {
    //         throw new HttpException(
    //             error.status || STATUS_CODES.ERROR.SERVER_ERROR,
    //             error.message || 'Server error'
    //         )
    //     }
    // }
    // private async transferFunds(transfer: Transfer): Promise<number | Error> {
    //     try {

    //         const externalId = transfer._id
    //         const amount = transfer.amount
    //         const phoneNumber = transfer.payeeNumber
    //         const payeeMessage = `Round Table Donation: ${transfer.purpose}, donated by: ${transfer.donatedBy}`
    //         const callbackUrl = API_HOST + '/api/donations/confirm-deposit'
    //         const headers = {
    //             'Api-Key': MOMO_SECRETS.VALLET_PAY_API_KEY,
    //             'Content-Type': 'application/json',
    //             'Callback-Url': callbackUrl,
    //         }

    //         const configHeaders = {
    //             headers,
    //         }

    //         const data = {
    //             amount,
    //             externalId,
    //             phoneNumber,
    //             payeeMessage,
    //         }

    //         const res = await axios.post(
    //             `${MOMO_SECRETS.VALLET_PAY_BASE_URL}/transaction/v1/deposit`,
    //             data,
    //             configHeaders
    //         )
    //         return res.data.code
    //     } catch (err: any) {
    //         console.log(err)
    //         return err.response.status
    //     }
    // }

    private async fetchToken(): Promise<string | Error> {
        try {
            const headers = {
                'Content-Type': 'application/x-www-form-urlencoded'
            }

            const configHeaders = {
                headers,
            }

            const data = {
                "username": MOMO_SECRETS.VALLET_PAY_CLIENT_SECRET_ID,
                "password": MOMO_SECRETS.VALLET_PAY_CLIENT_SECRET,
            }

            const res = await axios.post(
                `${MOMO_SECRETS.VALLET_PAY_BASE_URL}/auth/api-login`,
                data,
                configHeaders
            )
            return res.data.accessToken
        } catch (err: any) {
            console.log(err)
            return err.response.status
        }
    }
}

function convertDateTime(inputDateTime: string): string {
    const parsedDateTime = new Date(inputDateTime);

    const year = parsedDateTime.getUTCFullYear();
    const month = ('0' + (parsedDateTime.getUTCMonth() + 1)).slice(-2);
    const day = ('0' + parsedDateTime.getUTCDate()).slice(-2);
    const hours = ('0' + parsedDateTime.getUTCHours()).slice(-2);
    const minutes = ('0' + parsedDateTime.getUTCMinutes()).slice(-2);
    const seconds = ('0' + parsedDateTime.getUTCSeconds()).slice(-2);
    const milliseconds = ('00' + parsedDateTime.getUTCMilliseconds()).slice(-3);

    // Format the date and time in ISO 8601 format
    const isoDateTime = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}Z`;

    return isoDateTime;
}

function sortByDate(donations: {createdAt: Date}[]): void {
    // Custom comparison function
    function compareDates(a: {createdAt: Date}, b: {createdAt: Date}): number {
        const dateA = new Date(a.createdAt);
        const dateB = new Date(b.createdAt);
        return dateB.getTime() - dateA.getTime();
    }

    // Sort the array using the custom comparison function
    donations.sort(compareDates);
}

export default DonationService
