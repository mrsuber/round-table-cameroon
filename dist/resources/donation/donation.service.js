"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const donation_1 = require("@/resources/donation");
const constants_1 = require("@/utils/helper/constants");
const http_exception_1 = __importDefault(require("@/utils/exceptions/http.exception"));
class DonationService {
    // MINUTES_BEFORE_REFRESH = 5
    // disbursementAccessToken = null as unknown as string
    // disbursementTokenRefereshTime = null as unknown as Date
    // collectionAccessToken = null as unknown as string
    // collectionTokenRefereshTime = null as unknown as Date
    /**
     * Create a new donation
     */
    initiateDonation(req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { purpose, description, amount, payerNumber, donatedBy } = req.body;
                const donation = yield new donation_1.DonationModel({
                    purpose,
                    description,
                    amount,
                    payerNumber,
                    donatedBy,
                }).save();
                let refillState = yield this.requestFunds(donation);
                const newState = refillState === "Pending" ? constants_1.DONATION_STATE.PENDING : constants_1.DONATION_STATE.FAILED;
                yield donation_1.DonationModel.findByIdAndUpdate(donation._id, {
                    state: newState,
                }).then(() => {
                    donation.state = newState;
                });
                donation.isDeleted = undefined;
                return donation;
            }
            catch (error) {
                throw new http_exception_1.default(error.status || constants_1.STATUS_CODES.ERROR.SERVER_ERROR, error.message || 'Server error');
            }
        });
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
    confirmTransfer(req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { externalId, status } = req.body;
                const newState = status === 'SUCCESSFUL'
                    ? constants_1.DONATION_STATE.SUCCESSFUL
                    : constants_1.DONATION_STATE.FAILED;
                yield donation_1.TransferModel.findByIdAndUpdate(externalId, {
                    state: newState,
                });
            }
            catch (error) {
                throw new http_exception_1.default(error.status || constants_1.STATUS_CODES.ERROR.SERVER_ERROR, error.message || 'Server error');
            }
        });
    }
    getDonations(req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const pageNumber = parseInt(req.query.pageNumber) ||
                    constants_1.PAGINATION.DEFAULT_PAGE_NUMBER;
                const pageLimit = parseInt(req.query.limit) ||
                    constants_1.PAGINATION.DEFAULT_PAGE_LIMIT;
                let state = req.query.state;
                if (state &&
                    state != constants_1.DONATION_STATE.PENDING &&
                    state != constants_1.DONATION_STATE.SUCCESSFUL &&
                    state != constants_1.DONATION_STATE.FAILED) {
                    throw new http_exception_1.default(constants_1.STATUS_CODES.ERROR.BAD_REQUEST, `Invalid request query, state must be '${constants_1.DONATION_STATE.PENDING}', '${constants_1.DONATION_STATE.SUCCESSFUL}' or '${constants_1.DONATION_STATE.FAILED}'`);
                }
                const startIndex = pageNumber * pageLimit;
                const endIndex = (pageNumber + 1) * pageLimit;
                const result = {
                    total: 0,
                    data: [],
                    rowsPerPage: 0,
                };
                result.total = yield donation_1.DonationModel.find(state ? { state } : {})
                    .countDocuments()
                    .exec();
                // Check if previous page exists and give page number
                if (startIndex > 0) {
                    result.previous = {
                        pageNumber: pageNumber - 1,
                        pageLimit,
                    };
                }
                // Check if next page exists and give page number
                if (endIndex < result.total) {
                    result.next = {
                        pageNumber: pageNumber + 1,
                        pageLimit,
                    };
                }
                result.data = yield donation_1.DonationModel.find(state ? { state } : {}, '-isDeleted')
                    .skip(startIndex)
                    .limit(pageLimit)
                    .exec();
                result.rowsPerPage = pageLimit;
                // console.log(result)
                const token = yield this.fetchToken();
                const headers = {
                    'Authorization': `Bearer ${token}`,
                };
                const configHeaders = {
                    headers,
                };
                const res = yield axios_1.default.get(`${constants_1.MOMO_SECRETS.VALLET_PAY_BASE_URL}/transaction`, configHeaders);
                const transactionData = res.data;
                for (let i = 0; i < transactionData.length; i++) {
                    result.data.push({
                        "donatedBy": "",
                        "amount": 0,
                        "purpose": transactionData[i].reason,
                        "engagedAmount": transactionData[i].amount,
                        "isTransaction": true,
                        "createdAt": convertDateTime(transactionData[i].date)
                    });
                }
                sortByDate(result.data);
                return result;
            }
            catch (error) {
                throw new http_exception_1.default(error.status || constants_1.STATUS_CODES.ERROR.SERVER_ERROR, error.message || 'Server error');
            }
        });
    }
    getValletBalance() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const token = yield this.fetchToken();
                const headers = {
                    'Authorization': `Bearer ${token}`,
                };
                const configHeaders = {
                    headers,
                };
                const res = yield axios_1.default.get(`${constants_1.MOMO_SECRETS.VALLET_PAY_BASE_URL}/transaction/wallet`, configHeaders);
                return Math.floor(res.data.balance);
            }
            catch (error) {
                console.log(error);
                throw new http_exception_1.default(error.status || constants_1.STATUS_CODES.ERROR.SERVER_ERROR, error.message || 'Server error');
            }
        });
    }
    getDonationsBalance(req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // const successfulDonations = await DonationModel.find(
                //     { state: DONATION_STATE.SUCCESSFUL },
                //     'amount'
                // )
                //     .exec()
                // const sum = successfulDonations.reduce((totalAmount, successfulDonation) => totalAmount + successfulDonation.amount, 0);
                req.query.state = constants_1.DONATION_STATE.SUCCESSFUL;
                req.query.limit = '1000';
                const data = yield this.getDonations(req);
                const donations = data.data;
                // console.log(donations)
                let balance = 0;
                for (let i = 0; i < donations.length; i++) {
                    const donation = donations[i];
                    if (donation.isTransaction) {
                        balance -= donation.engagedAmount;
                    }
                    else {
                        balance += donation.amount;
                    }
                }
                return balance;
            }
            catch (error) {
                console.log(error);
                throw new http_exception_1.default(error.status || constants_1.STATUS_CODES.ERROR.SERVER_ERROR, error.message || 'Server error');
            }
        });
    }
    getTransfers(req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const pageNumber = parseInt(req.query.pageNumber) ||
                    constants_1.PAGINATION.DEFAULT_PAGE_NUMBER;
                const pageLimit = parseInt(req.query.limit) ||
                    constants_1.PAGINATION.DEFAULT_PAGE_LIMIT;
                let state = req.query.state;
                if (state &&
                    state != constants_1.DONATION_STATE.PENDING &&
                    state != constants_1.DONATION_STATE.SUCCESSFUL &&
                    state != constants_1.DONATION_STATE.FAILED) {
                    throw new http_exception_1.default(constants_1.STATUS_CODES.ERROR.BAD_REQUEST, `Invalid request query, state must be '${constants_1.DONATION_STATE.PENDING}', '${constants_1.DONATION_STATE.SUCCESSFUL}' or '${constants_1.DONATION_STATE.FAILED}'`);
                }
                const startIndex = pageNumber * pageLimit;
                const endIndex = (pageNumber + 1) * pageLimit;
                const result = {
                    total: 0,
                    data: [],
                    rowsPerPage: 0,
                };
                result.total = yield donation_1.TransferModel.find(state ? { state } : {})
                    .countDocuments()
                    .exec();
                // Check if previous page exists and give page number
                if (startIndex > 0) {
                    result.previous = {
                        pageNumber: pageNumber - 1,
                        pageLimit,
                    };
                }
                // Check if next page exists and give page number
                if (endIndex < result.total) {
                    result.next = {
                        pageNumber: pageNumber + 1,
                        pageLimit,
                    };
                }
                result.data = yield donation_1.TransferModel.find(state ? { state } : {}, '-isDeleted')
                    .skip(startIndex)
                    .limit(pageLimit)
                    .exec();
                result.rowsPerPage = pageLimit;
                return result;
            }
            catch (error) {
                throw new http_exception_1.default(error.status || constants_1.STATUS_CODES.ERROR.SERVER_ERROR, error.message || 'Server error');
            }
        });
    }
    requestFunds(donation) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const token = yield this.fetchToken();
                const externalId = donation._id;
                const amount = donation.amount;
                const phoneNumber = `${donation.payerNumber}`;
                const payerMessage = donation.purpose;
                const callbackUrl = constants_1.API_HOST + '/api/donations/confirm-withdrawal';
                const headers = {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    'Callback-Url': callbackUrl,
                };
                const configHeaders = {
                    headers,
                };
                const data = {
                    amount,
                    externalId,
                    "accountNumber": phoneNumber,
                    payerMessage,
                };
                const res = yield axios_1.default.post(`${constants_1.MOMO_SECRETS.VALLET_PAY_BASE_URL}/transaction/v1/collect-funds`, data, configHeaders);
                return res.data.refillState;
            }
            catch (err) {
                console.log(err);
                return err.response.status;
            }
        });
    }
    confirmWithdrawal(req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { externalId, status } = req.body;
                yield donation_1.DonationModel.findByIdAndUpdate(externalId, { state: status });
                // if (status === 'SUCCESSFUL') {
                //     const donation = await DonationModel.findById(externalId).exec()
                //     if (donation) {
                //         this.initiateTransfer(donation)
                //     }
                // }
            }
            catch (error) {
                throw new http_exception_1.default(error.status || constants_1.STATUS_CODES.ERROR.SERVER_ERROR, error.message || 'Server error');
            }
        });
    }
    deleteDonation(req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const donationId = req.params.donationId;
                const donation = yield donation_1.DonationModel.findById(donationId).exec();
                if (!donation) {
                    throw new http_exception_1.default(constants_1.STATUS_CODES.ERROR.NOT_FOUND, 'Donation not found');
                }
                yield donation_1.DonationModel.findByIdAndDelete(donation._id).exec();
            }
            catch (error) {
                throw new http_exception_1.default(error.status || constants_1.STATUS_CODES.ERROR.SERVER_ERROR, error.message || 'Server error');
            }
        });
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
    fetchToken() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const headers = {
                    'Content-Type': 'application/x-www-form-urlencoded'
                };
                const configHeaders = {
                    headers,
                };
                const data = {
                    "username": constants_1.MOMO_SECRETS.VALLET_PAY_CLIENT_SECRET_ID,
                    "password": constants_1.MOMO_SECRETS.VALLET_PAY_CLIENT_SECRET,
                };
                const res = yield axios_1.default.post(`${constants_1.MOMO_SECRETS.VALLET_PAY_BASE_URL}/auth/api-login`, data, configHeaders);
                return res.data.accessToken;
            }
            catch (err) {
                console.log(err);
                return err.response.status;
            }
        });
    }
}
function convertDateTime(inputDateTime) {
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
function sortByDate(donations) {
    // Custom comparison function
    function compareDates(a, b) {
        const dateA = new Date(a.createdAt);
        const dateB = new Date(b.createdAt);
        return dateB.getTime() - dateA.getTime();
    }
    // Sort the array using the custom comparison function
    donations.sort(compareDates);
}
exports.default = DonationService;
