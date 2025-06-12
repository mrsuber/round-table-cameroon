"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const initiateDonation = joi_1.default.object({
    purpose: joi_1.default.string().required(),
    description: joi_1.default.string().required(),
    amount: joi_1.default.number().required(),
    payerNumber: joi_1.default.string().required(),
    donatedBy: joi_1.default.string().required(),
});
exports.default = {
    initiateDonation,
};
