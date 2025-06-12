"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = exports.ContactController = exports.ContactService = exports.SubscriberModel = exports.PartnerModel = exports.FormModel = void 0;
var form_model_1 = require("@/resources/contact/models/form.model");
Object.defineProperty(exports, "FormModel", { enumerable: true, get: function () { return __importDefault(form_model_1).default; } });
var partner_model_1 = require("@/resources/contact/models/partner.model");
Object.defineProperty(exports, "PartnerModel", { enumerable: true, get: function () { return __importDefault(partner_model_1).default; } });
var subscriber_model_1 = require("@/resources/contact/models/subscriber.model");
Object.defineProperty(exports, "SubscriberModel", { enumerable: true, get: function () { return __importDefault(subscriber_model_1).default; } });
var contact_service_1 = require("@/resources/contact/contact.service");
Object.defineProperty(exports, "ContactService", { enumerable: true, get: function () { return __importDefault(contact_service_1).default; } });
var contact_controller_1 = require("@/resources/contact/contact.controller");
Object.defineProperty(exports, "ContactController", { enumerable: true, get: function () { return __importDefault(contact_controller_1).default; } });
var contact_validation_1 = require("@/resources/contact/contact.validation");
Object.defineProperty(exports, "validate", { enumerable: true, get: function () { return __importDefault(contact_validation_1).default; } });
