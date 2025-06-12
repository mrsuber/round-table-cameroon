"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OtpModel = exports.PasswordCodeModel = void 0;
var passwordCode_model_1 = require("@/utils/models/passwordCode.model");
Object.defineProperty(exports, "PasswordCodeModel", { enumerable: true, get: function () { return __importDefault(passwordCode_model_1).default; } });
var otp_model_1 = require("@/utils/models/otp.model");
Object.defineProperty(exports, "OtpModel", { enumerable: true, get: function () { return __importDefault(otp_model_1).default; } });
