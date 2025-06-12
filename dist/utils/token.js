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
exports.verifyResetToken = exports.verifyToken = exports.createResetPasswordToken = exports.createRefreshToken = exports.createAccessToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const constants_1 = require("@/utils/helper/constants");
const createAccessToken = (user) => {
    return jsonwebtoken_1.default.sign({ id: user._id, role: user.role }, constants_1.JWT_INFO.SECRET, {
        expiresIn: constants_1.JWT_INFO.ACCESS_TOKEN_DUR + 's'
    });
};
exports.createAccessToken = createAccessToken;
const createRefreshToken = (user) => {
    return jsonwebtoken_1.default.sign({ id: user._id }, constants_1.JWT_INFO.SECRET, {
        expiresIn: constants_1.JWT_INFO.REFRESH_TOKEN_DUR + 's'
    });
};
exports.createRefreshToken = createRefreshToken;
const createResetPasswordToken = (email) => {
    return jsonwebtoken_1.default.sign({ email }, constants_1.JWT_INFO.RESET_TOKEN_SECRET, {
        expiresIn: constants_1.JWT_INFO.ACCESS_TOKEN_DUR + 's'
    });
};
exports.createResetPasswordToken = createResetPasswordToken;
const verifyToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        jsonwebtoken_1.default.verify(token, constants_1.JWT_INFO.SECRET, (err, payload) => {
            if (err)
                return reject(err);
            resolve(payload);
        });
    });
});
exports.verifyToken = verifyToken;
const verifyResetToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        jsonwebtoken_1.default.verify(token, constants_1.JWT_INFO.RESET_TOKEN_SECRET, (err, payload) => {
            if (err)
                return reject(err);
            resolve(payload);
        });
    });
});
exports.verifyResetToken = verifyResetToken;
exports.default = { createAccessToken: exports.createAccessToken, createRefreshToken: exports.createRefreshToken, createResetPasswordToken: exports.createResetPasswordToken, verifyToken: exports.verifyToken, verifyResetToken: exports.verifyResetToken };
