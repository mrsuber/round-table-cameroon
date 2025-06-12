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
const contact_1 = require("@/resources/contact");
const file_1 = require("@/resources/file");
const constants_1 = require("@/utils/helper/constants");
const utils_1 = require("@/utils/helper/utils");
const http_exception_1 = __importDefault(require("@/utils/exceptions/http.exception"));
class ContactService {
    /**
     * Create new form
     */
    createForm(req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { fullNames, email, message } = req.body;
                yield new contact_1.FormModel({
                    fullNames,
                    email,
                    message,
                }).save();
            }
            catch (error) {
                throw new http_exception_1.default(error.status || constants_1.STATUS_CODES.ERROR.SERVER_ERROR, error.message || 'Server error');
            }
        });
    }
    /**
     * Get created forms
     */
    getForms(req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const pageNumber = parseInt(req.query.pageNumber) ||
                    constants_1.PAGINATION.DEFAULT_PAGE_NUMBER;
                const pageLimit = parseInt(req.query.limit) ||
                    constants_1.PAGINATION.DEFAULT_PAGE_LIMIT;
                const result = (yield (0, utils_1.getPaginatedData)(pageNumber, pageLimit, contact_1.FormModel, {}, '', 'createdAt'));
                return result;
            }
            catch (error) {
                throw new http_exception_1.default(error.status || constants_1.STATUS_CODES.ERROR.SERVER_ERROR, error.message || 'Server error');
            }
        });
    }
    /**
     * Add new partner
     */
    addPartner(req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { name, moreInfo } = req.body;
                let partner = yield contact_1.PartnerModel.findOne({
                    name,
                }).exec();
                if (partner) {
                    throw new http_exception_1.default(constants_1.STATUS_CODES.ERROR.CONFLICT, 'Failed! There is already a partner with this name!');
                }
                new contact_1.PartnerModel({
                    name,
                    moreInfo,
                }).save();
            }
            catch (error) {
                throw new http_exception_1.default(error.status || constants_1.STATUS_CODES.ERROR.SERVER_ERROR, error.message || 'Server error');
            }
        });
    }
    /**
     * Get partners
     */
    getPartners(req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const pageNumber = parseInt(req.query.pageNumber) ||
                    constants_1.PAGINATION.DEFAULT_PAGE_NUMBER;
                const pageLimit = parseInt(req.query.limit) ||
                    constants_1.PAGINATION.DEFAULT_PAGE_LIMIT;
                const startIndex = pageNumber * pageLimit;
                const endIndex = (pageNumber + 1) * pageLimit;
                const result = {
                    total: 0,
                    data: [],
                    rowsPerPage: 0,
                };
                result.total = yield contact_1.PartnerModel
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
                result.data = yield contact_1.PartnerModel
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
                    .exec();
                result.rowsPerPage = pageLimit;
                let data = [];
                for (let i = 0; i < result.data.length; i++) {
                    let partner = result.data[i];
                    if (partner.logo) {
                        partner.logo.dirPath = undefined;
                        partner.logo.httpPath = constants_1.API_HOST + constants_1.UPLOADS_SHORT_URL + String(partner.logo._id) + '.' + partner.logo.httpPath;
                    }
                    data.push(partner);
                }
                result.data = result.data.map((partner) => {
                    return {
                        id: partner._id,
                        name: partner.name,
                        moreInfo: partner.moreInfo,
                        logo: partner.logo
                            ? constants_1.API_HOST + '/api/uploads/' + partner.logo
                            : null,
                    };
                });
                result.data = data;
                return result;
            }
            catch (error) {
                throw new http_exception_1.default(error.status || constants_1.STATUS_CODES.ERROR.SERVER_ERROR, error.message || 'Server error');
            }
        });
    }
    /**
     * Update partner logo
     */
    uploadPartnerLogo(req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { partnerId } = req.body;
                const userId = req.user._id;
                if (req.files) {
                    const file = req.files.image;
                    const partner = yield contact_1.PartnerModel.findById(partnerId).exec();
                    if (!partner) {
                        throw new http_exception_1.default(constants_1.STATUS_CODES.ERROR.NOT_FOUND, 'Partner not found');
                    }
                    let arr = file.name.split('.');
                    // Extension of image
                    const ext = arr[arr.length - 1];
                    const filePath = (0, utils_1.saveFile)(constants_1.FILE_STRUCTURE.PARTNER_LOGO_DIR, file);
                    const fileId = partner.logo;
                    if (fileId) {
                        yield file_1.FileModel.findByIdAndUpdate(fileId, { deleted: true });
                    }
                    let newFile = yield new file_1.FileModel({
                        httpPath: ext,
                        dirPath: filePath,
                        name: file.name,
                        size: file.size,
                        mimetype: file.mimetype,
                        uploadedBy: userId
                    }).save();
                    yield contact_1.PartnerModel.findByIdAndUpdate(partnerId, {
                        logo: newFile._id,
                    });
                }
                else {
                    throw new http_exception_1.default(constants_1.STATUS_CODES.ERROR.BAD_REQUEST, 'Upload failed, no image found');
                }
            }
            catch (error) {
                throw new http_exception_1.default(error.status || constants_1.STATUS_CODES.ERROR.SERVER_ERROR, error.message || 'Server error');
            }
        });
    }
    /**
     * Subscribe function
     */
    subscribe(req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email } = req.body;
                const subscriber = yield contact_1.SubscriberModel.findOne({ email });
                if (subscriber) {
                    throw new http_exception_1.default(constants_1.STATUS_CODES.ERROR.CONFLICT, 'Already subscribed');
                }
                new contact_1.SubscriberModel({
                    email,
                }).save();
            }
            catch (error) {
                throw new http_exception_1.default(error.status || constants_1.STATUS_CODES.ERROR.SERVER_ERROR, error.message || 'Server error');
            }
        });
    }
    /**
     * Get subscribed emails
     */
    getSubscribers(req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const pageNumber = parseInt(req.query.pageNumber) ||
                    constants_1.PAGINATION.DEFAULT_PAGE_NUMBER;
                const pageLimit = parseInt(req.query.limit) ||
                    constants_1.PAGINATION.DEFAULT_PAGE_LIMIT;
                const result = (yield (0, utils_1.getPaginatedData)(pageNumber, pageLimit, contact_1.SubscriberModel, {}, 'email', 'createdAt'));
                return result;
            }
            catch (error) {
                throw new http_exception_1.default(error.status || constants_1.STATUS_CODES.ERROR.SERVER_ERROR, error.message || 'Server error');
            }
        });
    }
}
exports.default = ContactService;
