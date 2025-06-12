"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const MessageSchema = new mongoose_1.Schema({
    content: {
        type: String,
        required: true,
    },
    from: {
        type: String,
        required: true,
        trim: true,
    },
    to: {
        type: String,
        required: true,
        trim: true,
    },
    deletedByReceiver: {
        type: Boolean,
        default: false,
    },
    files: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'File',
        },
    ],
}, { timestamps: true });
exports.default = (0, mongoose_1.model)('Message', MessageSchema);
