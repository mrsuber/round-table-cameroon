"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = exports.ProjectService = exports.ProjectModel = exports.ProjectController = void 0;
var project_controller_1 = require("@/resources/project/project.controller");
Object.defineProperty(exports, "ProjectController", { enumerable: true, get: function () { return __importDefault(project_controller_1).default; } });
var project_model_1 = require("@/resources/project/project.model");
Object.defineProperty(exports, "ProjectModel", { enumerable: true, get: function () { return __importDefault(project_model_1).default; } });
var project_service_1 = require("@/resources/project/project.service");
Object.defineProperty(exports, "ProjectService", { enumerable: true, get: function () { return __importDefault(project_service_1).default; } });
var project_validation_1 = require("@/resources/project/project.validation");
Object.defineProperty(exports, "validate", { enumerable: true, get: function () { return __importDefault(project_validation_1).default; } });
