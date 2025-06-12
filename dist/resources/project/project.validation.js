"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const addProject = joi_1.default.object({
    title: joi_1.default.string().required(),
    managerId: joi_1.default.string().required(),
});
const toggleProjectStatus = joi_1.default.object({
    projectId: joi_1.default.string().required(),
});
const addContributors = joi_1.default.object({
    projectId: joi_1.default.string().required(),
    contributorId: joi_1.default.array().required(),
});
const removeContributor = joi_1.default.object({
    projectId: joi_1.default.string().required(),
    contributorId: joi_1.default.string().required(),
});
const editProject = joi_1.default.object({
    publicProject: joi_1.default.bool().required(),
    title: joi_1.default.string().required(),
    date: joi_1.default.string().required(),
    ongoing: joi_1.default.bool().required(),
    description: joi_1.default.string().required(),
    labels: joi_1.default.array().required(),
    projectId: joi_1.default.string().required(),
});
const addManager = joi_1.default.object({
    projectId: joi_1.default.string().required(),
    managerId: joi_1.default.string().required(),
});
const removeAttachment = joi_1.default.object({
    projectId: joi_1.default.string().required(),
    filepath: joi_1.default.string().required(),
});
exports.default = {
    addProject,
    toggleProjectStatus,
    addContributors,
    removeContributor,
    editProject,
    addManager,
    removeAttachment,
};
