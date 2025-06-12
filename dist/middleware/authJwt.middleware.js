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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const token_1 = require("@/utils/token");
const user_model_1 = __importDefault(require("@/resources/user/user.model"));
const http_exception_1 = __importDefault(require("@/utils/exceptions/http.exception"));
const constants_1 = require("@/utils/helper/constants");
const extractRole = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const bearer = req.headers.authorization;
    if (!bearer || !bearer.startsWith('Bearer ')) {
        throw new http_exception_1.default(401, 'Unauthorised');
    }
    const accessToken = bearer.split('Bearer ')[1].trim();
    const payload = yield (0, token_1.verifyToken)(accessToken);
    if (payload instanceof jsonwebtoken_1.default.JsonWebTokenError) {
        throw new http_exception_1.default(401, 'Unauthorised');
    }
    return payload;
});
const addUserInfo = (req, id) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.default.findOne({ _id: id, isDeleted: false })
        .select('-password')
        .exec();
    if (!user) {
        throw new http_exception_1.default(401, 'Unauthorised');
    }
    req.user = user;
});
const isUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = yield extractRole(req);
        const { id, role } = token;
        if (role === constants_1.ROLES.USER ||
            role === constants_1.ROLES.MEMBER ||
            role === constants_1.ROLES.SUPER_ADMIN) {
            yield addUserInfo(req, String(id));
            return next();
        }
        else {
            return next(new http_exception_1.default(403, 'Requires valid access token!'));
        }
    }
    catch (error) {
        next(new http_exception_1.default(401, 'Unauthorized!'));
    }
});
const isMember = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = yield extractRole(req);
        const { id, role } = token;
        if (role === constants_1.ROLES.MEMBER ||
            role === constants_1.ROLES.SUPER_ADMIN) {
            yield addUserInfo(req, String(id));
            return next();
        }
        else {
            return next(new http_exception_1.default(403, 'Requires Member Role!'));
        }
    }
    catch (error) {
        next(new http_exception_1.default(401, 'Unauthorized!'));
    }
});
const isSuperAdmin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = yield extractRole(req);
        const { id, role } = token;
        if (role === constants_1.ROLES.SUPER_ADMIN) {
            yield addUserInfo(req, String(id));
            next();
        }
        else {
            next(new http_exception_1.default(403, 'Requires Super Admin Role!'));
        }
    }
    catch (error) {
        next(new http_exception_1.default(401, 'Unauthorized!'));
    }
});
const authJwt = {
    isUser,
    isMember,
    isSuperAdmin,
};
exports.default = authJwt;
