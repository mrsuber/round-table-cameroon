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
exports.sendMail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const constants_1 = require("@/utils/helper/constants");
const mailTemplates_1 = require("@/utils/mailTemplates");
const http_exception_1 = __importDefault(require("@/utils/exceptions/http.exception"));
const transporter = nodemailer_1.default.createTransport(constants_1.MAIL_SETTINGS);
const sendMail = (params) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let info = yield transporter.sendMail({
            from: constants_1.MAIL_SETTINGS.auth.user,
            to: params.email,
            subject: params.verification === true
                ? 'Account Registration Details'
                : 'Reset Password Request',
            html: params.verification
                ? (0, mailTemplates_1.signUpSuccessTemplate)({
                    email: params.email,
                    otpCode: params.otpCode,
                    firstName: params.firstName,
                    lastName: params.lastName,
                })
                : (0, mailTemplates_1.forgottenPasswordTemplate)({
                    verificationCode: params.otpCode,
                    firstName: params.firstName,
                    lastName: params.lastName,
                }),
        });
        return info;
    }
    catch (error) {
        throw new http_exception_1.default(error.status || constants_1.STATUS_CODES.ERROR.SERVER_ERROR, error.message || 'Server error, could not send mail');
    }
});
exports.sendMail = sendMail;
