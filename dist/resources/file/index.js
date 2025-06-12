"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileService = exports.FileModel = exports.FileController = void 0;
var file_controller_1 = require("@/resources/file/file.controller");
Object.defineProperty(exports, "FileController", { enumerable: true, get: function () { return __importDefault(file_controller_1).default; } });
var file_model_1 = require("@/resources/file/file.model");
Object.defineProperty(exports, "FileModel", { enumerable: true, get: function () { return __importDefault(file_model_1).default; } });
var file_service_1 = require("@/resources/file/file.service");
Object.defineProperty(exports, "FileService", { enumerable: true, get: function () { return __importDefault(file_service_1).default; } });
