"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const GeneralSettingsSchema = new mongoose_1.Schema({
    region: {
        type: String,
        default: 'South West',
        trim: true,
    },
    language: {
        type: String,
        default: 'English',
        trim: true,
    },
    timezone: {
        type: String,
        default: 'GMT+1',
        trim: true,
    },
    twelveHourFormat: {
        type: Boolean,
        default: true,
    },
}, { timestamps: true });
exports.default = (0, mongoose_1.model)('GeneralSettings', GeneralSettingsSchema);
