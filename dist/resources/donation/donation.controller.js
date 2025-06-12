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
const donation_1 = require("@/resources/donation");
const index_1 = require("@/middleware/index");
const constants_1 = require("@/utils/helper/constants");
class DonationController {
    constructor() {
        this.path = '/donations';
        this.router = (0, express_1.Router)();
        this.donationService = new donation_1.DonationService();
        this.initializeRoutes = () => {
            this.router.post(`${this.path}`, [(0, index_1.validationMiddleware)(donation_1.validate.initiateDonation)], this.initiateDonation);
            this.router.post(`${this.path}/confirm-withdrawal`, this.confirmWithdrawal);
            // this.router.post(`${this.path}/confirm-deposit`, this.confirmTransfer)
            this.router.get(`${this.path}`, 
            // [authJwt.isSuperAdmin],
            this.getDonations);
            this.router.get(`${this.path}/transfers`, 
            // [authJwt.isSuperAdmin],
            this.getTransfers);
            this.router.get(`${this.path}/balance`, this.getDonationsBalance);
            this.router.get(`${this.path}/vallet-pay-balance`, this.getValletBalance);
            this.router.delete(`${this.path}/:donationId`, [index_1.authJwt.isSuperAdmin], this.deleteDonation);
        };
        this.initiateDonation = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const donation = yield this.donationService.initiateDonation(req);
                res.status(constants_1.STATUS_CODES.SUCCESS.CREATED_SUCCESSFULLY).json({
                    donation,
                });
            }
            catch (error) {
                next(new http_exception_1.default(error.status, error.message));
            }
        });
        this.confirmTransfer = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.donationService.confirmTransfer(req);
                res.status(constants_1.STATUS_CODES.SUCCESS.SUCCESSFUL_REQUEST).json({
                    success: true,
                });
            }
            catch (error) {
                next(new http_exception_1.default(error.status, error.message));
            }
        });
        this.getDonations = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.donationService.getDonations(req);
                res.status(constants_1.STATUS_CODES.SUCCESS.SUCCESSFUL_REQUEST).json({ result });
            }
            catch (error) {
                next(new http_exception_1.default(error.status, error.message));
            }
        });
        this.getDonationsBalance = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const balance = yield this.donationService.getDonationsBalance(req);
                res.status(constants_1.STATUS_CODES.SUCCESS.SUCCESSFUL_REQUEST).json({ balance });
            }
            catch (error) {
                next(new http_exception_1.default(error.status, error.message));
            }
        });
        this.getValletBalance = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const balance = yield this.donationService.getValletBalance();
                res.status(constants_1.STATUS_CODES.SUCCESS.SUCCESSFUL_REQUEST).json({ balance });
            }
            catch (error) {
                next(new http_exception_1.default(error.status, error.message));
            }
        });
        this.getTransfers = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.donationService.getTransfers(req);
                res.status(constants_1.STATUS_CODES.SUCCESS.SUCCESSFUL_REQUEST).json({ result });
            }
            catch (error) {
                next(new http_exception_1.default(error.status, error.message));
            }
        });
        this.confirmWithdrawal = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.donationService.confirmWithdrawal(req);
                res.status(constants_1.STATUS_CODES.SUCCESS.SUCCESSFUL_REQUEST).json({
                    "success": true
                });
            }
            catch (error) {
                next(new http_exception_1.default(error.status, error.message));
            }
        });
        this.deleteDonation = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.donationService.deleteDonation(req);
                res.status(constants_1.STATUS_CODES.SUCCESS.SUCCESSFUL_REQUEST).json({
                    success: true,
                });
            }
            catch (error) {
                next(new http_exception_1.default(error.status, error.message));
            }
        });
        this.initializeRoutes();
    }
}
exports.default = DonationController;
