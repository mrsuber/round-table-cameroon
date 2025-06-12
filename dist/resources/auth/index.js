"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = exports.AuthService = exports.AuthController = void 0;
var auth_controller_1 = require("@/resources/auth/auth.controller");
Object.defineProperty(exports, "AuthController", { enumerable: true, get: function () { return __importDefault(auth_controller_1).default; } });
var auth_service_1 = require("@/resources/auth/auth.service");
Object.defineProperty(exports, "AuthService", { enumerable: true, get: function () { return __importDefault(auth_service_1).default; } });
var auth_validation_1 = require("@/resources/auth/auth.validation");
Object.defineProperty(exports, "validate", { enumerable: true, get: function () { return __importDefault(auth_validation_1).default; } });
