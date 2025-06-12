"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
require("module-alias/register");
const http_1 = __importDefault(require("http"));
const express_1 = __importDefault(require("express"));
const app_1 = __importDefault(require("./app"));
const ValidateEnv_1 = __importDefault(require("@/utils/ValidateEnv"));
const project_1 = require("@/resources/project");
const user_1 = require("@/resources/user");
const contact_1 = require("@/resources/contact");
const message_1 = require("@/resources/message");
const auth_1 = require("@/resources/auth");
const file_1 = require("@/resources/file");
const task_1 = require("@/resources/task");
const donation_1 = require("@/resources/donation");
(0, ValidateEnv_1.default)();
const expressServer = (0, express_1.default)();
const httpServer = http_1.default.createServer(expressServer);
new app_1.default([
    new auth_1.AuthController(),
    new project_1.ProjectController(),
    new user_1.UserController(),
    new contact_1.ContactController(),
    new message_1.MessageController(httpServer),
    new file_1.FileController(),
    new task_1.TaskController(),
    new donation_1.DonationController()
], Number(process.env.PORT), expressServer, httpServer);
