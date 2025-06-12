"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const NotificationSettingsSchema = new mongoose_1.Schema({
    dailyNewsletter: {
        type: Boolean,
        default: true,
    },
    message: {
        type: Boolean,
        default: true,
    },
    projectUpdate: {
        type: Boolean,
        default: true,
    },
    projectDeadline: {
        type: Boolean,
        default: true,
    },
}, { timestamps: true });
exports.default = (0, mongoose_1.model)('NotificationSettings', NotificationSettingsSchema);
