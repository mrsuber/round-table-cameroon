"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransferModel = exports.validate = exports.DonationService = exports.DonationModel = exports.DonationController = void 0;
var donation_controller_1 = require("@/resources/donation/donation.controller");
Object.defineProperty(exports, "DonationController", { enumerable: true, get: function () { return __importDefault(donation_controller_1).default; } });
var donation_model_1 = require("@/resources/donation/donation.model");
Object.defineProperty(exports, "DonationModel", { enumerable: true, get: function () { return __importDefault(donation_model_1).default; } });
var donation_service_1 = require("@/resources/donation/donation.service");
Object.defineProperty(exports, "DonationService", { enumerable: true, get: function () { return __importDefault(donation_service_1).default; } });
var donation_validation_1 = require("@/resources/donation/donation.validation");
Object.defineProperty(exports, "validate", { enumerable: true, get: function () { return __importDefault(donation_validation_1).default; } });
var transfer_model_1 = require("@/resources/donation/transfer/transfer.model");
Object.defineProperty(exports, "TransferModel", { enumerable: true, get: function () { return __importDefault(transfer_model_1).default; } });
