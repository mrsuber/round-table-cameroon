"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageService = exports.MessageModel = exports.MessageController = void 0;
var message_controller_1 = require("@/resources/message/message.controller");
Object.defineProperty(exports, "MessageController", { enumerable: true, get: function () { return __importDefault(message_controller_1).default; } });
var message_model_1 = require("@/resources/message/message.model");
Object.defineProperty(exports, "MessageModel", { enumerable: true, get: function () { return __importDefault(message_model_1).default; } });
var message_service_1 = require("@/resources/message/message.service");
Object.defineProperty(exports, "MessageService", { enumerable: true, get: function () { return __importDefault(message_service_1).default; } });
