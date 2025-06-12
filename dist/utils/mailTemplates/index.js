"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signUpSuccessTemplate = exports.forgottenPasswordTemplate = void 0;
var forgotPassword_1 = require("@/utils/mailTemplates/forgotPassword");
Object.defineProperty(exports, "forgottenPasswordTemplate", { enumerable: true, get: function () { return __importDefault(forgotPassword_1).default; } });
var signUpSuccess_1 = require("@/utils/mailTemplates/signUpSuccess");
Object.defineProperty(exports, "signUpSuccessTemplate", { enumerable: true, get: function () { return __importDefault(signUpSuccess_1).default; } });
