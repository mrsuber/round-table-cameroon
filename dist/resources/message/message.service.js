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
const message_1 = require("@/resources/message");
const http_exception_1 = __importDefault(require("@/utils/exceptions/http.exception"));
const constants_1 = require("@/utils/helper/constants");
const file_1 = require("@/resources/file");
class MessageService {
    /**
     * Fetch user's messages
     */
    fetchMessages(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const messagesPerUser = new Map();
                const messages = yield message_1.MessageModel.find({
                    $or: [{ from: userId }, { to: userId }],
                }).populate('files').exec();
                for (let i = 0; i < messages.length; i++) {
                    let message = messages[i];
                    for (let j = 0; j < message.files.length; j++) {
                        let messageFile = message.files[j];
                        messageFile.dirPath = undefined;
                        messageFile.deleted = undefined;
                        messageFile.httpPath = constants_1.API_HOST + constants_1.UPLOADS_SHORT_URL + String(messageFile._id) + '.' + messageFile.httpPath;
                    }
                    const { from, to, deletedByReceiver } = message;
                    if (deletedByReceiver && userId === to) {
                    }
                    else {
                        const otherUser = userId === from ? to : from;
                        if (messagesPerUser.has(otherUser)) {
                            messagesPerUser.get(otherUser).push(message);
                        }
                        else {
                            messagesPerUser.set(otherUser, [message]);
                        }
                    }
                }
                return messagesPerUser;
            }
            catch (error) {
                throw new http_exception_1.default(error.status || constants_1.STATUS_CODES.ERROR.SERVER_ERROR, error.message || 'Server error');
            }
        });
    }
    /**
     * Save message
     */
    saveMessage(message) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield new message_1.MessageModel({
                    content: message.content,
                    to: message.to,
                    from: message.from,
                    files: message.files.map(file => file._id),
                }).save();
            }
            catch (error) {
                throw new http_exception_1.default(error.status || constants_1.STATUS_CODES.ERROR.SERVER_ERROR, error.message || 'Server error');
            }
        });
    }
    getMessages(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const pageNumber = parseInt(req.query.pageNumber) ||
                constants_1.PAGINATION.DEFAULT_PAGE_NUMBER;
            const pageLimit = parseInt(req.query.limit) ||
                constants_1.PAGINATION.DEFAULT_PAGE_LIMIT;
            try {
                const startIndex = pageNumber * pageLimit;
                const endIndex = (pageNumber + 1) * pageLimit;
                const result = {
                    total: 0,
                    data: [],
                    rowsPerPage: 0,
                };
                result.total = yield message_1.MessageModel
                    .find()
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
                result.data = yield message_1.MessageModel
                    .find()
                    .sort('createdAt')
                    .skip(startIndex)
                    .limit(pageLimit)
                    .populate('files')
                    .exec();
                result.rowsPerPage = pageLimit;
                for (let i = 0; i < result.data.length; i++) {
                    let message = result.data[i];
                    for (let j = 0; j < message.files.length; j++) {
                        let messageFile = message.files[j];
                        messageFile.dirPath = undefined;
                        messageFile.httpPath = constants_1.API_HOST + constants_1.UPLOADS_SHORT_URL + String(messageFile._id) + '.' + messageFile.httpPath;
                    }
                }
                return result;
            }
            catch (error) {
                throw new http_exception_1.default(error.status || constants_1.STATUS_CODES.ERROR.SERVER_ERROR, error.message || 'Server error');
            }
        });
    }
    getUserMessages(req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.user._id;
                const result = yield this.fetchMessages(userId);
                const messages = Object.fromEntries(result);
                return messages;
            }
            catch (error) {
                throw new http_exception_1.default(error.status || constants_1.STATUS_CODES.ERROR.SERVER_ERROR, error.message || 'Server error');
            }
        });
    }
    deleteMessages(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { messageIds } = req.body;
            const userId = String(req.user._id);
            try {
                messageIds.forEach((messageId) => this.deleteMessage(userId, messageId));
            }
            catch (error) {
                throw new http_exception_1.default(error.status || constants_1.STATUS_CODES.ERROR.SERVER_ERROR, error.message || 'Server error');
            }
        });
    }
    deleteMessage(userId, messageId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const message = yield message_1.MessageModel.findById(messageId)
                    .select('files from to deletedByReceiver')
                    .exec();
                if (message) {
                    if (userId === (message === null || message === void 0 ? void 0 : message.from)) {
                        yield message_1.MessageModel.findByIdAndDelete(messageId).exec();
                        for (let i = 0; i < message.files.length; i++) {
                            yield file_1.FileModel.findByIdAndUpdate(message.files[i], {
                                deleted: true
                            });
                        }
                        console.log('Message deleted');
                    }
                    else if (userId === (message === null || message === void 0 ? void 0 : message.to)) {
                        if (message.deletedByReceiver) {
                            console.log('Message already deleted for receiver');
                        }
                        else {
                            yield message_1.MessageModel.findByIdAndUpdate(messageId, {
                                deletedByReceiver: true,
                            });
                            console.log('Message deleted for receiver');
                        }
                    }
                    else {
                        console.log('Unauthorized user');
                    }
                }
                else {
                    console.log('Message not found');
                }
            }
            catch (error) {
                throw new http_exception_1.default(error.status || constants_1.STATUS_CODES.ERROR.SERVER_ERROR, error.message || 'Server error');
            }
        });
    }
}
exports.default = MessageService;
