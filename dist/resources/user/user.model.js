"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const bcrypt_1 = __importDefault(require("bcrypt"));
const settings_1 = require("@/resources/user/settings");
const UserSchema = new mongoose_1.Schema({
    email: {
        type: String,
        required: true,
        trim: true,
    },
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    username: {
        type: String,
    },
    profession: {
        type: String,
    },
    town: {
        type: String,
    },
    gender: {
        type: String,
    },
    about: {
        type: String,
        required: false,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        required: true,
    },
    profileImage: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'File',
    },
    isUser: {
        type: Boolean,
        default: false,
    },
    isMember: {
        type: Boolean,
        default: false,
    },
    facebook: {
        type: String,
        required: false,
    },
    linkedIn: {
        type: String,
        required: false,
    },
    twitter: {
        type: String,
        required: false,
    },
    managedProjects: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'Project',
        },
    ],
    projects: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'Project',
        },
    ],
    numberOfProjects: {
        type: Number,
        required: false,
    },
    generalSettings: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'GeneralSettings',
    },
    notificationSettings: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'NotificationSettings',
    },
    isDeleted: {
        type: Boolean,
        default: false,
    }
}, { timestamps: true });
UserSchema.pre('save', function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!this.isModified('password')) {
            return next();
        }
        const hash = yield bcrypt_1.default.hash(this.password, 10);
        this.password = hash;
        this.generalSettings = yield new settings_1.GeneralSettingsModel().save();
        this.notificationSettings = yield new settings_1.NotificationSettingsModel().save();
        next();
    });
});
UserSchema.methods.isValidPassword = function (password) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield bcrypt_1.default.compare(password, this.password);
    });
};
exports.default = (0, mongoose_1.model)('User', UserSchema);
