"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const PartnerSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    moreInfo: {
        type: String,
        trim: true,
    },
    logo: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'File',
    },
}, {
    timestamps: true,
});
exports.default = (0, mongoose_1.model)('Partner', PartnerSchema);
