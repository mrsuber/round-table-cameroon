"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationSettingsModel = exports.GeneralSettingsModel = void 0;
var general_settings_model_1 = require("@/resources/user/settings/general-settings.model");
Object.defineProperty(exports, "GeneralSettingsModel", { enumerable: true, get: function () { return __importDefault(general_settings_model_1).default; } });
var notification_settings_model_1 = require("@/resources/user/settings/notification-settings.model");
Object.defineProperty(exports, "NotificationSettingsModel", { enumerable: true, get: function () { return __importDefault(notification_settings_model_1).default; } });
