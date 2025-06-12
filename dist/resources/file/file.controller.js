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
const http_exception_1 = __importDefault(require("@/utils/exceptions/http.exception"));
const file_1 = require("@/resources/file");
const index_1 = require("@/middleware/index");
const constants_1 = require("@/utils/helper/constants");
class FileController {
    constructor() {
        this.path = '/uploads';
        this.router = (0, express_1.Router)();
        this.fileService = new file_1.FileService();
        this.initializeRoutes = () => {
            this.router.get(`${this.path}`, [index_1.authJwt.isSuperAdmin], this.getFiles);
            this.router.get(`${this.path}/admin/:fileId`, [index_1.authJwt.isSuperAdmin], this.adminGetFile);
            this.router.get(`${this.path}/:fileId`, this.getFile);
        };
        this.getFile = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const file = (yield this.fileService.getFile(req, false));
                res.status(constants_1.STATUS_CODES.SUCCESS.SUCCESSFUL_REQUEST).sendFile(file.dirPath);
            }
            catch (error) {
                next(new http_exception_1.default(error.status, error.message));
            }
        });
        this.adminGetFile = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const file = (yield this.fileService.getFile(req, true));
                res.status(constants_1.STATUS_CODES.SUCCESS.SUCCESSFUL_REQUEST).sendFile(file.dirPath);
            }
            catch (error) {
                next(new http_exception_1.default(error.status, error.message));
            }
        });
        this.getFiles = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield this.fileService.getFiles();
                res.status(constants_1.STATUS_CODES.SUCCESS.SUCCESSFUL_REQUEST).json(data);
            }
            catch (error) {
                next(new http_exception_1.default(error.status, error.message));
            }
        });
        this.initializeRoutes();
    }
}
exports.default = FileController;
