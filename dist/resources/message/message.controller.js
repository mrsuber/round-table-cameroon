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
const express_1 = require("express");
const path_1 = __importDefault(require("path"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const fs_1 = require("fs");
const token_1 = require("@/utils/token");
const http_exception_1 = __importDefault(require("@/utils/exceptions/http.exception"));
const message_1 = require("@/resources/message");
const file_1 = require("@/resources/file");
const sessionStore_1 = __importDefault(require("@/utils/helper/sessionStore"));
const constants_1 = require("@/utils/helper/constants");
const utils_1 = require("@/utils/helper/utils");
const index_1 = require("@/middleware/index");
class MessageController {
    constructor(httpServer) {
        this.path = '/messages';
        this.router = (0, express_1.Router)();
        this.messageService = new message_1.MessageService();
        this.getMessages = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.messageService.getMessages(req);
                res.status(constants_1.STATUS_CODES.SUCCESS.SUCCESSFUL_REQUEST).json({ result });
            }
            catch (error) {
                next(new http_exception_1.default(error.status, error.message));
            }
        });
        this.getUserMessages = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const messages = yield this.messageService.getUserMessages(req);
                res.status(constants_1.STATUS_CODES.SUCCESS.SUCCESSFUL_REQUEST).json({ messages });
            }
            catch (error) {
                next(new http_exception_1.default(error.status, error.message));
            }
        });
        this.deleteMessages = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.messageService.deleteMessages(req);
                res.status(constants_1.STATUS_CODES.SUCCESS.SUCCESSFUL_REQUEST).json({
                    success: true,
                });
            }
            catch (error) {
                next(new http_exception_1.default(error.status, error.message));
            }
        });
        this.io = require('socket.io')(httpServer, {
            cors: {
                origin: 'http://localhost:3000',
            },
        });
        this.sessionStore = new sessionStore_1.default();
        this.initializeRoutes();
    }
    initializeRoutes() {
        // For development purposes
        this.router.get(`${this.path}`, index_1.authJwt.isSuperAdmin, this.getMessages);
        this.router.get(`${this.path}/user-messages`, index_1.authJwt.isMember, this.getUserMessages);
        this.router.post(`${this.path}/delete-messages`, index_1.authJwt.isMember, this.deleteMessages);
        this.io
            .use((socket, next) => __awaiter(this, void 0, void 0, function* () {
            if (socket.handshake.query && socket.handshake.query.token) {
                console.log(socket.handshake.query.token);
                try {
                    const payload = yield (0, token_1.verifyToken)(socket.handshake.query.token);
                    if (payload instanceof jsonwebtoken_1.default.JsonWebTokenError) {
                        return next(new http_exception_1.default(401, 'Unauthorised socket access'));
                    }
                    // Store user id
                    socket.userID = payload.id;
                }
                catch (error) {
                    return next(new http_exception_1.default(401, 'Authentication failed'));
                }
            }
            else {
                return next(new http_exception_1.default(401, 'Authentication query not found'));
            }
            try {
                const userId = socket.userID;
                const session = this.sessionStore.findSession(userId);
                if (session) {
                    socket.username = session.username;
                }
                else {
                    const username = yield (0, utils_1.getUsername)(userId);
                    socket.username = username;
                }
                next();
            }
            catch (error) {
                return next(new http_exception_1.default(500, 'Failed to get session'));
            }
        }))
            .on('connection', (socket) => __awaiter(this, void 0, void 0, function* () {
            try {
                // persist session
                this.sessionStore.saveSession(socket.userID, {
                    userID: socket.userID,
                    username: socket.username,
                    connected: true,
                });
                // emit session details
                socket.emit('session', {
                    username: socket.username,
                    userID: socket.userID,
                });
                // join the "userID" room
                socket.join(socket.userID);
                // retrieve messages
                const messagesPerUser = (yield this.messageService.fetchMessages(socket.userID));
                // fetch existing users
                const users = [];
                this.sessionStore.findAllSessions().forEach((session) => {
                    users.push({
                        userID: session.userID,
                        username: session.username,
                        connected: session.connected,
                        messages: messagesPerUser.get(session.userID) || [],
                        self: socket.userID === session.userID,
                    });
                });
                socket.emit('users', users);
                // notify existing users
                socket.broadcast.emit('user connected', {
                    userID: socket.userID,
                    username: socket.username,
                    connected: true,
                    messages: [],
                });
                // forward the private message to the right recipient (and to other tabs of the sender)
                socket.on('private message', ({ content, to, }) => __awaiter(this, void 0, void 0, function* () {
                    console.log('backend content', content, to);
                    if (!to)
                        return;
                    try {
                        const { text, files } = content;
                        const messageFiles = [];
                        for (let i = 0; i < files.length; i++) {
                            let fileData = files[i];
                            const arr = fileData.name.split('.');
                            const ext = arr[arr.length - 1];
                            // Add random integer to file name
                            let newFileName = `${arr[0]}___${Date.now() % 1000}.${ext}`;
                            const filePath = path_1.default.join(constants_1.FILE_STRUCTURE.MESSAGE_FILES_DIR, newFileName);
                            (0, fs_1.writeFile)(filePath, fileData.file, (err) => {
                                console.log(err);
                            });
                            let newFile = yield new file_1.FileModel({
                                httpPath: ext,
                                dirPath: filePath,
                                name: fileData.name,
                                size: fileData.size,
                                mimetype: fileData.mimetype,
                                uploadedBy: socket.userID
                            }).save();
                            messageFiles.push(newFile);
                        }
                        const message = {
                            content: text,
                            from: socket.userID,
                            to,
                            files: messageFiles,
                        };
                        this.messageService.saveMessage(message);
                        for (let j = 0; j < messageFiles.length; j++) {
                            let messageFile = messageFiles[j];
                            messageFile.dirPath = undefined;
                            messageFile.deleted = undefined;
                            messageFile.httpPath = constants_1.API_HOST + constants_1.UPLOADS_SHORT_URL + String(messageFile._id) + '.' + messageFile.httpPath;
                        }
                        socket
                            .to(to)
                            .to(socket.userID)
                            .emit('private message', message);
                    }
                    catch (error) {
                        socket
                            .to(socket.userID)
                            .emit('private message', {
                            content: 'MESSAGE NOT SENT',
                            to: to,
                            from: socket.userID,
                        });
                    }
                }));
                // notify users upon disconnection
                socket.on('disconnect', () => __awaiter(this, void 0, void 0, function* () {
                    const matchingSockets = yield this.io
                        .in(socket.userID)
                        .allSockets();
                    const isDisconnected = matchingSockets.size === 0;
                    if (isDisconnected) {
                        // notify other users
                        socket.broadcast.emit('user disconnected', socket.userID);
                        // update the connection status of the session
                        this.sessionStore.saveSession(socket.userID, {
                            userID: socket.userID,
                            username: socket.username,
                            connected: false,
                        });
                    }
                }));
            }
            catch (error) {
                throw new http_exception_1.default(error.status || constants_1.STATUS_CODES.ERROR.SERVER_ERROR, error.message || 'Server error');
            }
        }));
    }
}
exports.default = MessageController;
