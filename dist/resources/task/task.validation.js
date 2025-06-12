"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const addSection = joi_1.default.object({
    name: joi_1.default.string().required(),
    projectId: joi_1.default.string().required(),
});
const editSubtaskDetails = joi_1.default.object({
    subtaskId: joi_1.default.string().required(),
    description: joi_1.default.string().required(),
});
const editTaskDetails = joi_1.default.object({
    name: joi_1.default.string().required(),
    priority: joi_1.default.string().required(),
    description: joi_1.default.string().required(),
    date: joi_1.default.string().required(),
});
const changeTaskSection = joi_1.default.object({
    newSectionId: joi_1.default.string().required(),
    taskId: joi_1.default.string().required(),
});
const removeTaskAssignee = joi_1.default.object({
    taskId: joi_1.default.string().required(),
    assigneeId: joi_1.default.string().required(),
});
const removeSubtask = joi_1.default.object({
    taskId: joi_1.default.string().required(),
    subtaskId: joi_1.default.string().required(),
});
const deleteAttachment = joi_1.default.object({
    taskId: joi_1.default.string().required(),
    filePath: joi_1.default.string().required(),
});
exports.default = {
    addSection,
    editSubtaskDetails,
    editTaskDetails,
    changeTaskSection,
    removeTaskAssignee,
    removeSubtask,
    deleteAttachment,
};
