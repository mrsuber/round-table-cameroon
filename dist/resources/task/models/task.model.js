"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const TaskSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
        trim: true,
    },
    priority: {
        type: String,
        required: true,
        trim: true,
    },
    assignees: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'User',
        },
    ],
    subTasks: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'SubTask',
        },
    ],
    subTaskTotal: {
        type: Number,
        default: 1,
    },
    subTaskCompleted: {
        type: Number,
        default: 0,
    },
    section: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Section',
    },
    date: {
        type: String,
        required: true,
        trim: true,
    },
    files: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'File',
        },
    ],
}, {
    timestamps: true,
});
exports.default = (0, mongoose_1.model)('Task', TaskSchema);
