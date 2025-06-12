"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const createForm = joi_1.default.object({
    fullNames: joi_1.default.string().required(),
    email: joi_1.default.string().email().required(),
    message: joi_1.default.string().required(),
});
const addPartner = joi_1.default.object({
    name: joi_1.default.string().required(),
    moreInfo: joi_1.default.string().required(),
});
const emailProvided = joi_1.default.object({
    email: joi_1.default.string().email().required(),
});
exports.default = { createForm, addPartner, emailProvided };
