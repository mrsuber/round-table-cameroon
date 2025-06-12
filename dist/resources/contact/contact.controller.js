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
const index_1 = require("@/middleware/index");
const contact_1 = require("@/resources/contact");
const constants_1 = require("@/utils/helper/constants");
class ContactController {
    constructor() {
        this.path = '/contacts';
        this.router = (0, express_1.Router)();
        this.contactService = new contact_1.ContactService();
        this.initializeRoutes = () => {
            /**
             * FORM
             */
            this.router.post(`${this.path}/create-form`, [
                (0, index_1.validationMiddleware)(contact_1.validate.createForm),
            ], this.createForm);
            this.router.get(`${this.path}/get-forms`, [index_1.authJwt.isSuperAdmin], this.getForms);
            /**
             * PARTNER
             */
            this.router.post(`${this.path}/add-partner`, [
                (0, index_1.validationMiddleware)(contact_1.validate.addPartner),
                index_1.authJwt.isSuperAdmin,
            ], this.addPartner);
            this.router.get(`${this.path}/get-partners`, this.getPartners);
            this.router.patch(`${this.path}/upload-partner-logo`, [index_1.authJwt.isSuperAdmin], this.uploadPartnerLogo);
            /**
             * SUBSCRIBER
             */
            this.router.post(`${this.path}/subscribe`, (0, index_1.validationMiddleware)(contact_1.validate.emailProvided), this.subscribe);
            this.router.get(`${this.path}/get-subscribers`, [index_1.authJwt.isSuperAdmin], this.getSubscribers);
        };
        /**
         * FORM
         */
        this.createForm = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.contactService.createForm(req);
                res.status(constants_1.STATUS_CODES.SUCCESS.CREATED_SUCCESSFULLY).json({
                    message: 'Form submitted successfully',
                });
            }
            catch (error) {
                next(new http_exception_1.default(error.status, error.message));
            }
        });
        this.getForms = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.contactService.getForms(req);
                res.status(constants_1.STATUS_CODES.SUCCESS.SUCCESSFUL_REQUEST).json({ result });
            }
            catch (error) {
                next(new http_exception_1.default(error.status, error.message));
            }
        });
        this.deleteForm = (req, res, next) => __awaiter(this, void 0, void 0, function* () { });
        /**
         * PARTNER
         */
        this.addPartner = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.contactService.addPartner(req);
                res.status(constants_1.STATUS_CODES.SUCCESS.CREATED_SUCCESSFULLY).json({
                    message: 'Partner added successfully',
                });
            }
            catch (error) {
                next(new http_exception_1.default(error.status, error.message));
            }
        });
        this.getPartners = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.contactService.getPartners(req);
                res.status(constants_1.STATUS_CODES.SUCCESS.SUCCESSFUL_REQUEST).json({ result });
            }
            catch (error) {
                next(new http_exception_1.default(error.status, error.message));
            }
        });
        this.uploadPartnerLogo = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.contactService.uploadPartnerLogo(req);
                res.status(constants_1.STATUS_CODES.SUCCESS.SUCCESSFUL_REQUEST).json({
                    message: 'Partner logo uploaded successfully',
                });
            }
            catch (error) {
                next(new http_exception_1.default(error.status, error.message));
            }
        });
        this.updatePartnerInfo = (req, res, next) => __awaiter(this, void 0, void 0, function* () { });
        this.removePartner = (req, res, next) => __awaiter(this, void 0, void 0, function* () { });
        /**
         * SUBSCRIBER
         */
        this.subscribe = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.contactService.subscribe(req);
                res.status(constants_1.STATUS_CODES.SUCCESS.CREATED_SUCCESSFULLY).json({
                    message: 'Subscription successfully',
                });
            }
            catch (error) {
                next(new http_exception_1.default(error.status, error.message));
            }
        });
        this.getSubscribers = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.contactService.getSubscribers(req);
                res.status(constants_1.STATUS_CODES.SUCCESS.SUCCESSFUL_REQUEST).json({ result });
            }
            catch (error) {
                next(new http_exception_1.default(error.status, error.message));
            }
        });
        this.unSubscribe = (req, res, next) => __awaiter(this, void 0, void 0, function* () { });
        this.confirmUnbscribing = (req, res, next) => __awaiter(this, void 0, void 0, function* () { });
        this.initializeRoutes();
    }
}
exports.default = ContactController;
