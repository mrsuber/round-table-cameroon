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
exports.tokenHasExpired = exports.createPasswordCode = exports.createOTP = void 0;
const otp_generator_1 = __importDefault(require("otp-generator"));
const models_1 = require("@/utils/models");
const constants_1 = require("@/utils/helper/constants");
const token_1 = require("@/utils/token");
const createOTP = (user) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const value = otp_generator_1.default.generate(constants_1.OTP_LENGTH, constants_1.OTP_CONFIG);
        let expiredAt = new Date();
        expiredAt.setSeconds(expiredAt.getSeconds() +
            parseInt(constants_1.AUTH_SETTINGS.OTP_EXPIRY));
        yield new models_1.OtpModel({
            value: value,
            userId: user._id,
            expiryDate: expiredAt.getTime(),
        }).save();
        return value;
    }
    catch (error) {
        return new Error('Could not generate otp');
    }
});
exports.createOTP = createOTP;
const createPasswordCode = (user) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const value = (0, token_1.createResetPasswordToken)(user.email);
        let expiredAt = new Date();
        expiredAt.setSeconds(expiredAt.getSeconds() +
            parseInt(constants_1.JWT_INFO.ACCESS_TOKEN_DUR));
        yield new models_1.PasswordCodeModel({
            value: value,
            userId: user._id,
            expiryDate: expiredAt.getTime(),
        }).save();
        return value;
    }
    catch (error) {
        return new Error('Could not generate otp');
    }
});
exports.createPasswordCode = createPasswordCode;
const tokenHasExpired = (token) => {
    return token.expiryDate.getTime() < new Date().getTime();
};
exports.tokenHasExpired = tokenHasExpired;
const authHelper = {
    createOTP: exports.createOTP,
    createPasswordCode: exports.createPasswordCode,
    tokenHasExpired: exports.tokenHasExpired,
};
exports.default = authHelper;
