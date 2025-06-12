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
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_1 = require("@/resources/user");
const models_1 = require("@/utils/models");
const token_1 = __importDefault(require("@/utils/token"));
const authHelper_1 = __importDefault(require("@/utils/helper/authHelper"));
const constants_1 = require("@/utils/helper/constants");
const http_exception_1 = __importDefault(require("@/utils/exceptions/http.exception"));
const token_2 = require("@/utils/token");
class AuthService {
    /**
     * Register a new user
     */
    register(req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { firstName, lastName, email, password } = req.body;
                let user = yield user_1.UserModel.findOne({
                    email, isDeleted: false
                }).exec();
                if (user) {
                    throw new http_exception_1.default(constants_1.STATUS_CODES.ERROR.CONFLICT, 'Failed! Email is already in use!');
                }
                else {
                    user = yield user_1.UserModel.create({
                        firstName,
                        lastName,
                        email,
                        password,
                        role: constants_1.ROLES.USER,
                    });
                    user.password = undefined;
                    user.isDeleted = undefined;
                    return user;
                }
            }
            catch (error) {
                throw new http_exception_1.default(error.status || constants_1.STATUS_CODES.ERROR.SERVER_ERROR, error.message || 'Server error');
            }
        });
    }
    /**
     * Attempt to login a user
     */
    login(req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                const user = yield user_1.UserModel.findOne({ email, isDeleted: false })
                    .select('-isDeleted')
                    .populate('generalSettings')
                    .populate('notificationSettings')
                    .exec();
                if (!user) {
                    throw new http_exception_1.default(constants_1.STATUS_CODES.ERROR.NOT_FOUND, 'Unable to find a user with that email address');
                }
                if (!user.isUser) {
                    throw new http_exception_1.default(constants_1.STATUS_CODES.ERROR.BAD_REQUEST, 'Email not verified');
                }
                if (yield user.isValidPassword(password)) {
                    user.password = undefined;
                    return {
                        accessToken: token_1.default.createAccessToken(user),
                        refreshToken: token_1.default.createRefreshToken(user),
                        user: user,
                    };
                }
                else {
                    throw new http_exception_1.default(constants_1.STATUS_CODES.ERROR.UNAUTHORIZED, 'Wrong credentials given');
                }
            }
            catch (error) {
                throw new http_exception_1.default(error.status || constants_1.STATUS_CODES.ERROR.SERVER_ERROR, error.message || 'Server error');
            }
        });
    }
    /**
     * Verify user's account
     */
    verifyAccount(req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, otp } = req.body;
                const user = yield user_1.UserModel.findOne({
                    email, isDeleted: false
                });
                if (!user) {
                    throw new http_exception_1.default(constants_1.STATUS_CODES.ERROR.NOT_FOUND, 'Sorry no account found with this email address');
                }
                if (user.isUser) {
                    throw new http_exception_1.default(constants_1.STATUS_CODES.ERROR.BAD_REQUEST, 'Your account has already been verified.');
                }
                const savedOtp = yield models_1.OtpModel.findOne({
                    userId: user._id,
                });
                if (!savedOtp) {
                    throw new http_exception_1.default(constants_1.STATUS_CODES.ERROR.NOT_FOUND, 'Verification code not found! Please request for a new one');
                }
                if (authHelper_1.default.tokenHasExpired(savedOtp)) {
                    models_1.OtpModel.findByIdAndRemove(savedOtp._id, {
                        useFindAndModify: false,
                    }).exec();
                    throw new http_exception_1.default(constants_1.STATUS_CODES.ERROR.BAD_REQUEST, 'Verification code had expired. Please request for a new one');
                }
                if (!bcrypt_1.default.compareSync(otp, savedOtp.value)) {
                    throw new http_exception_1.default(constants_1.STATUS_CODES.ERROR.BAD_REQUEST, 'Invalid OTP Code.');
                }
                yield user_1.UserModel.findByIdAndUpdate(user._id, {
                    isUser: true,
                });
                yield models_1.OtpModel.findByIdAndRemove(savedOtp._id, {
                    useFindAndModify: false,
                });
            }
            catch (error) {
                throw new http_exception_1.default(error.status || constants_1.STATUS_CODES.ERROR.SERVER_ERROR, error.message || 'Server error');
            }
        });
    }
    /**
     * Refresh user's access token
     */
    refreshToken(req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { refreshToken } = req.body;
                const payload = yield token_1.default.verifyToken(refreshToken);
                if (payload instanceof jsonwebtoken_1.default.JsonWebTokenError) {
                    throw new http_exception_1.default(constants_1.STATUS_CODES.ERROR.UNAUTHORIZED, 'Unauthorised');
                }
                const user = yield user_1.UserModel.findOne({ _id: payload.id, isDeleted: false }).exec();
                if (!user) {
                    throw new http_exception_1.default(constants_1.STATUS_CODES.ERROR.UNAUTHORIZED, 'Unauthorised');
                }
                return {
                    accessToken: token_1.default.createAccessToken(user),
                    refreshToken,
                };
            }
            catch (error) {
                throw new http_exception_1.default(error.status || constants_1.STATUS_CODES.ERROR.SERVER_ERROR, error.message || 'Server error');
            }
        });
    }
    /**
     * Create password token for user
     */
    createPasswordToken(req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email } = req.body;
                const user = yield user_1.UserModel.findOne({
                    email, isDeleted: false
                });
                if (!user) {
                    throw new http_exception_1.default(constants_1.STATUS_CODES.ERROR.NOT_FOUND, `User with email ${email} not found.`);
                }
                const existingToken = yield models_1.PasswordCodeModel.findOne({
                    userId: user._id,
                });
                if (existingToken) {
                    models_1.PasswordCodeModel.findByIdAndRemove(existingToken._id, {
                        useFindAndModify: false,
                    }).exec();
                }
                let data = {
                    firstName: user.firstName,
                    lastName: user.lastName,
                    token: yield authHelper_1.default.createPasswordCode(user),
                };
                return data;
            }
            catch (error) {
                throw new http_exception_1.default(error.status || constants_1.STATUS_CODES.ERROR.SERVER_ERROR, error.message || 'Server error');
            }
        });
    }
    /**
     * Reset user password
     */
    resetPassword(req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { password, token } = req.body;
                const payload = yield (0, token_2.verifyResetToken)(token);
                if (payload instanceof jsonwebtoken_1.default.JsonWebTokenError) {
                    throw new http_exception_1.default(constants_1.STATUS_CODES.ERROR.UNAUTHORIZED, 'Invalid token.');
                }
                const user = yield user_1.UserModel.findOne({
                    email: payload.email, isDeleted: false
                });
                if (!user) {
                    throw new http_exception_1.default(constants_1.STATUS_CODES.ERROR.NOT_FOUND, 'Sorry no account found with this email address.');
                }
                const passwordToken = yield models_1.PasswordCodeModel.findOne({
                    userId: user._id,
                });
                if (!passwordToken) {
                    throw new http_exception_1.default(constants_1.STATUS_CODES.ERROR.NOT_FOUND, 'Reset token not found! Please request for a new one');
                }
                if (authHelper_1.default.tokenHasExpired(passwordToken)) {
                    models_1.PasswordCodeModel.findByIdAndRemove(passwordToken._id, {
                        useFindAndModify: false,
                    }).exec();
                    throw new http_exception_1.default(constants_1.STATUS_CODES.ERROR.BAD_REQUEST, 'Password token has expired. Please request for a new one');
                }
                if (!bcrypt_1.default.compareSync(token, passwordToken.value)) {
                    throw new http_exception_1.default(constants_1.STATUS_CODES.ERROR.BAD_REQUEST, 'Invalid password token.');
                }
                if (yield user.isValidPassword(password)) {
                    yield models_1.PasswordCodeModel.findByIdAndRemove(passwordToken._id, {
                        useFindAndModify: false,
                    });
                    throw new http_exception_1.default(constants_1.STATUS_CODES.ERROR.BAD_REQUEST, 'The new password should not be same as the old one.');
                }
                else {
                    yield user_1.UserModel.findByIdAndUpdate(user._id, {
                        $set: { password: bcrypt_1.default.hashSync(password, 10) },
                    }).then(yield models_1.PasswordCodeModel.findByIdAndRemove(passwordToken._id, {
                        useFindAndModify: false,
                    }));
                }
            }
            catch (error) {
                throw new http_exception_1.default(error.status || constants_1.STATUS_CODES.ERROR.SERVER_ERROR, error.message || 'Server error');
            }
        });
    }
    /**
     * resend verification code
     */
    resendVerificationCode(req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email } = req.body;
                const user = yield user_1.UserModel.findOne({
                    email, isDeleted: false
                });
                if (!user) {
                    throw new http_exception_1.default(constants_1.STATUS_CODES.ERROR.NOT_FOUND, `User with email ${email} not found.`);
                }
                if (user.isUser) {
                    throw new http_exception_1.default(constants_1.STATUS_CODES.ERROR.BAD_REQUEST, 'Your account has already been verified.');
                }
                const savedOtp = yield models_1.OtpModel.findOne({
                    userId: user._id,
                });
                if (savedOtp) {
                    models_1.OtpModel.findByIdAndRemove(savedOtp._id, {
                        useFindAndModify: false,
                    }).exec();
                }
                let data = {
                    firstName: user.firstName,
                    lastName: user.lastName,
                    token: yield authHelper_1.default.createOTP(user),
                };
                return data;
            }
            catch (error) {
                throw new http_exception_1.default(error.status || constants_1.STATUS_CODES.ERROR.SERVER_ERROR, error.message || 'Server error');
            }
        });
    }
    /**
     * Change password
     */
    changePassword(req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { oldPassword, newPassword } = req.body;
                const user = (yield user_1.UserModel.findOne({ email: req.user.email, isDeleted: false }));
                if (!user) {
                    throw new http_exception_1.default(constants_1.STATUS_CODES.ERROR.NOT_FOUND, 'Unable to find user with that email address');
                }
                if (yield user.isValidPassword(oldPassword)) {
                    if (oldPassword === newPassword) {
                        throw new http_exception_1.default(constants_1.STATUS_CODES.ERROR.BAD_REQUEST, 'The new password should not be same as the old one.');
                    }
                    yield user_1.UserModel.findByIdAndUpdate(user._id, {
                        password: yield bcrypt_1.default.hash(newPassword, 10)
                    });
                }
                else {
                    throw new http_exception_1.default(constants_1.STATUS_CODES.ERROR.BAD_REQUEST, 'Incorrect old password.');
                }
            }
            catch (error) {
                throw new http_exception_1.default(error.status || constants_1.STATUS_CODES.ERROR.SERVER_ERROR, error.message || 'Server error');
            }
        });
    }
}
exports.default = AuthService;
