"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const ProjectSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    date: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
    },
    projectImage: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'File',
    },
    ongoing: {
        type: Boolean,
        default: false,
    },
    publicProject: {
        type: Boolean,
        default: false,
    },
    labels: [
        {
            type: String,
        },
    ],
    projectManager: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'User',
        },
    ],
    contributors: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'User',
        },
    ],
    sections: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'Section',
        },
    ],
    attachments: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'File',
        },
    ],
}, {
    timestamps: true,
});
exports.default = (0, mongoose_1.model)('Project', ProjectSchema);
