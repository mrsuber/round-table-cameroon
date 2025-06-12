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
const user_1 = require("@/resources/user");
const project_1 = require("@/resources/project");
const file_1 = require("@/resources/file");
const settings_1 = require("@/resources/user/settings");
const constants_1 = require("@/utils/helper/constants");
const utils_1 = require("@/utils/helper/utils");
const http_exception_1 = __importDefault(require("@/utils/exceptions/http.exception"));
class UserService {
    /**
     * Get user's complete profile
     */
    getUser(req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield user_1.UserModel.findOne({ _id: req.user._id, isDeleted: false })
                    .select('-password -isUser -isMember -isDeleted')
                    .populate({
                    path: 'profileImage',
                    select: {
                        deleted: 0
                    }
                })
                    .populate('managedProjects')
                    .populate('projects')
                    .populate('generalSettings')
                    .populate('notificationSettings')
                    .exec();
                if (!user) {
                    throw new http_exception_1.default(constants_1.STATUS_CODES.ERROR.NOT_FOUND, 'User not found');
                }
                if (user.profileImage) {
                    user.profileImage.dirPath = undefined;
                    user.profileImage.httpPath = constants_1.API_HOST + constants_1.UPLOADS_SHORT_URL + String(user.profileImage._id) + '.' + user.profileImage.httpPath;
                }
                return user;
            }
            catch (error) {
                throw new http_exception_1.default(error.status || constants_1.STATUS_CODES.ERROR.SERVER_ERROR, error.message || 'Server error');
            }
        });
    }
    activateUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const files = yield file_1.FileModel
                    .find()
                    .exec();
                for (let i = 0; i < files.length; i++) {
                    let file = files[i];
                    yield file_1.FileModel.findByIdAndUpdate(file._id, {
                        deleted: false,
                    });
                }
            }
            catch (error) {
                throw new http_exception_1.default(error.status || constants_1.STATUS_CODES.ERROR.SERVER_ERROR, error.message || 'Server error');
            }
        });
    }
    /**
     * Upload profile image
     */
    uploadProfileImage(req) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const file = (_a = req.files) === null || _a === void 0 ? void 0 : _a.image;
                if (!file) {
                    throw new http_exception_1.default(constants_1.STATUS_CODES.ERROR.BAD_REQUEST, 'No image uploaded');
                }
                let userId = req.user._id;
                let arr = file.name.split('.');
                // Extension of image
                let ext = arr[arr.length - 1];
                const filePath = (0, utils_1.saveFile)(constants_1.FILE_STRUCTURE.USER_PROFILE_DIR, file);
                const fileId = req.user.profileImage;
                if (fileId) {
                    yield file_1.FileModel.findByIdAndUpdate(fileId, { deleted: true });
                }
                let newFile = yield new file_1.FileModel({
                    httpPath: ext,
                    dirPath: filePath,
                    name: file.name,
                    size: file.size,
                    mimetype: file.mimetype,
                    uploadedBy: userId
                }).save();
                yield user_1.UserModel.findByIdAndUpdate(userId, {
                    profileImage: newFile._id,
                });
            }
            catch (error) {
                throw new http_exception_1.default(error.status || constants_1.STATUS_CODES.ERROR.SERVER_ERROR, error.message || 'Server error');
            }
        });
    }
    /**
     * Update general settings
     */
    updateGeneralSettings(req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { region, language, timezone, twelveHourFormat } = req.body;
                if (req.user.generalSettings) {
                    yield settings_1.GeneralSettingsModel.findByIdAndUpdate(req.user.generalSettings, {
                        region,
                        language,
                        timezone,
                        twelveHourFormat,
                    });
                }
                else {
                    let generalSettings = yield new settings_1.GeneralSettingsModel({
                        region,
                        language,
                        timezone,
                        twelveHourFormat,
                    }).save();
                    yield user_1.UserModel.findByIdAndUpdate(req.user._id, {
                        generalSettings
                    });
                }
            }
            catch (error) {
                throw new http_exception_1.default(error.status || constants_1.STATUS_CODES.ERROR.SERVER_ERROR, error.message || 'Server error');
            }
        });
    }
    /**
     * Update notification settings
     */
    updateNotificationSettings(req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { dailyNewsletter, message, projectUpdate, projectDeadline } = req.body;
                if (req.user.notificationSettings) {
                    yield settings_1.NotificationSettingsModel.findByIdAndUpdate(req.user.notificationSettings, {
                        dailyNewsletter,
                        message,
                        projectUpdate,
                        projectDeadline,
                    });
                }
                else {
                    let notificationSettings = yield new settings_1.NotificationSettingsModel({
                        dailyNewsletter,
                        message,
                        projectUpdate,
                        projectDeadline,
                    }).save();
                    yield user_1.UserModel.findByIdAndUpdate(req.user._id, {
                        notificationSettings
                    });
                }
            }
            catch (error) {
                throw new http_exception_1.default(error.status || constants_1.STATUS_CODES.ERROR.SERVER_ERROR, error.message || 'Server error');
            }
        });
    }
    /**
     * Approve user to become member
     */
    approveMember(req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email } = req.body;
                const user = yield user_1.UserModel.findOne({
                    email, isDeleted: false
                });
                if (!user) {
                    throw new http_exception_1.default(constants_1.STATUS_CODES.ERROR.NOT_FOUND, 'User not found');
                }
                if (user.isMember) {
                    throw new http_exception_1.default(constants_1.STATUS_CODES.ERROR.BAD_REQUEST, 'User has already been approved');
                }
                // Make sure account is verified before allowing approval
                if (!user.isUser) {
                    throw new http_exception_1.default(constants_1.STATUS_CODES.ERROR.BAD_REQUEST, 'User has not been verified');
                }
                else {
                    yield user_1.UserModel.findByIdAndUpdate(user._id, {
                        $set: {
                            isMember: true,
                            role: constants_1.ROLES.MEMBER,
                        },
                    });
                }
            }
            catch (error) {
                throw new http_exception_1.default(error.status || constants_1.STATUS_CODES.ERROR.SERVER_ERROR, error.message || 'Server error');
            }
        });
    }
    makeAdmin(req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email } = req.body;
                const user = yield user_1.UserModel.findOne({
                    email, isDeleted: false
                });
                if (!user) {
                    throw new http_exception_1.default(constants_1.STATUS_CODES.ERROR.NOT_FOUND, 'User not found');
                }
                yield user_1.UserModel.findByIdAndUpdate(user._id, {
                    $set: {
                        role: constants_1.ROLES.SUPER_ADMIN,
                    },
                });
            }
            catch (error) {
                throw new http_exception_1.default(error.status || constants_1.STATUS_CODES.ERROR.SERVER_ERROR, error.message || 'Server error');
            }
        });
    }
    /**
     * Get members
     */
    getMembers(req, searchParams) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const pageNumber = parseInt(req.query.pageNumber) ||
                    constants_1.PAGINATION.DEFAULT_PAGE_NUMBER;
                const pageLimit = parseInt(req.query.limit) ||
                    constants_1.PAGINATION.DEFAULT_PAGE_LIMIT;
                const startIndex = pageNumber * pageLimit;
                const endIndex = (pageNumber + 1) * pageLimit;
                const result = {
                    total: 0,
                    data: [],
                    rowsPerPage: 0,
                };
                result.total = yield user_1.UserModel
                    .find(Object.assign({}, searchParams))
                    .countDocuments()
                    .exec();
                // Check if previous page exists and give page number
                if (startIndex > 0) {
                    result.previous = {
                        pageNumber: pageNumber - 1,
                        pageLimit,
                    };
                }
                // Check if next page exists and give page number
                if (endIndex < result.total) {
                    result.next = {
                        pageNumber: pageNumber + 1,
                        pageLimit,
                    };
                }
                result.data = yield user_1.UserModel
                    .find(Object.assign({}, searchParams), '-password -isDeleted')
                    .sort('createdAt')
                    .skip(startIndex)
                    .limit(pageLimit)
                    .populate({
                    path: 'profileImage',
                    select: {
                        deleted: 0
                    }
                })
                    .exec();
                result.rowsPerPage = pageLimit;
                for (let i = 0; i < result.data.length; i++) {
                    let user = result.data[i];
                    user.description = user.description ? user.description : null;
                    user.numberOfProjects = user.projects.length + user.managedProjects.length;
                    if (user.profileImage) {
                        user.profileImage.dirPath = undefined;
                        user.profileImage.httpPath = constants_1.API_HOST + constants_1.UPLOADS_SHORT_URL + String(user.profileImage._id) + '.' + user.profileImage.httpPath;
                    }
                }
                return result;
            }
            catch (error) {
                throw new http_exception_1.default(error.status || constants_1.STATUS_CODES.ERROR.SERVER_ERROR, error.message || 'Server error');
            }
        });
    }
    /**
     * Update profile details
     */
    updateProfile(req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = req.user;
                const { firstName, lastName, about, linkedIn, facebook, twitter, username, profession, town, gender, } = req.body;
                yield user_1.UserModel.findByIdAndUpdate(user._id, {
                    firstName,
                    lastName,
                    about,
                    linkedIn,
                    facebook,
                    twitter,
                    username,
                    profession,
                    town,
                    gender,
                });
            }
            catch (error) {
                throw new http_exception_1.default(error.status || constants_1.STATUS_CODES.ERROR.SERVER_ERROR, error.message || 'Server error');
            }
        });
    }
    /**
     * Delete user account
     */
    deleteAccount(req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = req.user;
                this.deleteAccountHelper(user);
            }
            catch (error) {
                throw new http_exception_1.default(error.status || constants_1.STATUS_CODES.ERROR.SERVER_ERROR, error.message || 'Server error');
            }
        });
    }
    deleteUserAccount(req) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(req.params.userId);
            const user = yield user_1.UserModel.findOne({ _id: req.params.userId, isDeleted: false }).exec();
            if (!user) {
                throw new http_exception_1.default(constants_1.STATUS_CODES.ERROR.NOT_FOUND, 'User not found');
            }
            if (user.role === constants_1.ROLES.SUPER_ADMIN) {
                throw new http_exception_1.default(constants_1.STATUS_CODES.ERROR.FORBIDDEN, "Cannot delete super admin's account");
            }
            try {
                this.deleteAccountHelper(user);
            }
            catch (error) {
                throw new http_exception_1.default(error.status || constants_1.STATUS_CODES.ERROR.SERVER_ERROR, error.message || 'Server error');
            }
        });
    }
    deleteAccountHelper(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const projects = user.projects;
            const managedProjects = user.managedProjects;
            for (let i = 0; i < projects.length; i++) {
                let project = yield project_1.ProjectModel.findById(projects[i]).exec();
                if (project) {
                    let contributors = project.contributors;
                    (0, utils_1.deleteElementInArray)(String(user._id), contributors);
                    yield project_1.ProjectModel.findByIdAndUpdate(project._id, {
                        contributors,
                    });
                }
            }
            for (let i = 0; i < managedProjects.length; i++) {
                let managedProject = yield project_1.ProjectModel.findById(managedProjects[i]).exec();
                if (managedProject) {
                    let projectManager = managedProject.projectManager;
                    (0, utils_1.deleteElementInArray)(String(user._id), projectManager);
                    yield project_1.ProjectModel.findByIdAndUpdate(managedProject._id, {
                        projectManager,
                    });
                }
            }
            yield user_1.UserModel.findByIdAndUpdate(user._id, {
                isDeleted: true
            });
        });
    }
}
exports.default = UserService;
