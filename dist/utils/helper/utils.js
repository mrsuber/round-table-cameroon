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
exports.isProjectManager = exports.capitalizeString = exports.addElementToArray = exports.deleteElementInArray = exports.getUsername = exports.saveFile = exports.getPaginatedData = exports.createSuperAdmin = exports.initializeDevelopmentDummyData = exports.deleteImagePath = exports.deleteFileByName = exports.findImageByName = void 0;
const path_1 = __importDefault(require("path"));
const promises_1 = require("fs/promises");
const user_1 = require("@/resources/user");
const constants_1 = require("@/utils/helper/constants");
const http_exception_1 = __importDefault(require("@/utils/exceptions/http.exception"));
const findImageByName = (directory, imageName) => __awaiter(void 0, void 0, void 0, function* () {
    const files = yield (0, promises_1.readdir)(directory);
    for (const file of files) {
        if (file.split('.')[0] === imageName) {
            return file;
        }
    }
});
exports.findImageByName = findImageByName;
const deleteFileByName = (directory, fileName) => __awaiter(void 0, void 0, void 0, function* () {
    const files = yield (0, promises_1.readdir)(directory);
    for (const file of files) {
        if (file.split('.')[0] === fileName) {
            try {
                yield (0, promises_1.unlink)(path_1.default.join(directory, file));
                console.log(`successfully deleted ${file}`);
            }
            catch (error) {
                console.error('there was an error:', error.message);
            }
        }
    }
});
exports.deleteFileByName = deleteFileByName;
const deleteImagePath = (path) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, promises_1.unlink)(path);
});
exports.deleteImagePath = deleteImagePath;
const initializeDevelopmentDummyData = () => __awaiter(void 0, void 0, void 0, function* () {
    let superAdmin = yield user_1.UserModel.findOne({
        email: 'superadmin@roundtable.com',
    });
    if (!superAdmin) {
        // Add test super admin
        yield new user_1.UserModel({
            firstName: 'Super',
            lastName: 'Admin',
            email: 'superadmin@roundtable.com',
            password: '12345678',
            isUser: true,
            isMember: true,
            role: constants_1.ROLES.SUPER_ADMIN,
        }).save();
        // Add test members
        for (let i = 1; i <= 10; i++) {
            yield new user_1.UserModel({
                firstName: 'Member',
                lastName: `Numero${i}`,
                email: `membernumero${i}@roundtable.com`,
                about: 'This is a test account',
                password: '12345678',
                isUser: true,
                isMember: true,
                role: constants_1.ROLES.MEMBER,
            }).save();
        }
        // Add test users
        for (let i = 1; i <= 10; i++) {
            yield new user_1.UserModel({
                firstName: 'User',
                lastName: `Numero${i}`,
                email: `usernumero${i}@roundtable.com`,
                about: 'This is a test account',
                password: '12345678',
                isUser: true,
                isMember: false,
                role: constants_1.ROLES.USER,
            }).save();
        }
        console.log('All users added');
    }
});
exports.initializeDevelopmentDummyData = initializeDevelopmentDummyData;
const createSuperAdmin = () => __awaiter(void 0, void 0, void 0, function* () {
    let superAdmin = yield user_1.UserModel.findOne({
        email: constants_1.SUPER_ADMIN.EMAIL,
    });
    if (superAdmin) {
        if (superAdmin.role !== constants_1.ROLES.SUPER_ADMIN) {
            yield user_1.UserModel.findByIdAndUpdate(superAdmin._id, {
                role: constants_1.ROLES.SUPER_ADMIN,
                isMember: true,
                isUser: true,
            });
            console.log('Super admin role updated');
        }
        else {
            console.log('Super admin present');
        }
    }
    else {
        yield new user_1.UserModel({
            firstName: constants_1.SUPER_ADMIN.FIRST_NAME,
            lastName: constants_1.SUPER_ADMIN.LAST_NAME,
            email: constants_1.SUPER_ADMIN.EMAIL,
            password: constants_1.SUPER_ADMIN.PASSWORD,
            isUser: true,
            isMember: true,
            role: constants_1.ROLES.SUPER_ADMIN,
        }).save();
        console.log('Super admin has been added');
    }
});
exports.createSuperAdmin = createSuperAdmin;
const getPaginatedData = (pageNumber, pageLimit, model, findCondition, fields, sort) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const startIndex = pageNumber * pageLimit;
        const endIndex = (pageNumber + 1) * pageLimit;
        const result = {
            total: 0,
            data: [],
            rowsPerPage: 0,
        };
        result.total = yield model
            .find(Object.assign({}, findCondition))
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
        result.data = yield model
            .find(Object.assign({}, findCondition), fields)
            .sort(sort)
            .skip(startIndex)
            .limit(pageLimit)
            .exec();
        result.rowsPerPage = pageLimit;
        return result;
    }
    catch (error) {
        throw new Error(error.message);
    }
});
exports.getPaginatedData = getPaginatedData;
/**
 * Save file
 */
const saveFile = (dir, file) => {
    try {
        let arr = file.name.split('.');
        let newFileName = `${arr[0]}___${Date.now() % 1000}.${arr[arr.length - 1]}`;
        const filePath = path_1.default.join(dir, newFileName);
        file.mv(filePath, (err) => {
            if (err)
                throw new http_exception_1.default(constants_1.STATUS_CODES.ERROR.SERVER_ERROR, 'File upload failed');
        });
        return filePath;
    }
    catch (error) {
        throw new http_exception_1.default(error.status || constants_1.STATUS_CODES.ERROR.SERVER_ERROR, error.message || 'Server error');
    }
};
exports.saveFile = saveFile;
const getUsername = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_1.UserModel.findById(userId)
        .select('firstName lastName')
        .exec();
    return (user === null || user === void 0 ? void 0 : user.firstName) + ' ' + (user === null || user === void 0 ? void 0 : user.lastName);
});
exports.getUsername = getUsername;
const deleteElementInArray = (element, arr) => __awaiter(void 0, void 0, void 0, function* () {
    for (let i = 0; i < arr.length; i++) {
        if (element === String(arr[i])) {
            arr.splice(i, 1);
            return;
        }
    }
});
exports.deleteElementInArray = deleteElementInArray;
const addElementToArray = (element, arr) => __awaiter(void 0, void 0, void 0, function* () {
    for (let i = 0; i < arr.length; i++) {
        if (element === String(arr[i])) {
            return;
        }
    }
    arr.push(element);
});
exports.addElementToArray = addElementToArray;
const capitalizeString = (string) => {
    const words = string.split(' ');
    const res = words
        .map((word) => {
        return word[0].toUpperCase() + word.substring(1);
    })
        .join(' ');
    return res;
};
exports.capitalizeString = capitalizeString;
const isProjectManager = (projectId, managedProjects) => {
    for (let i = 0; i < managedProjects.length; i++) {
        if (String(managedProjects[i]) === projectId) {
            return true;
        }
    }
    return false;
};
exports.isProjectManager = isProjectManager;
const utils = {
    findImageByName: exports.findImageByName,
    deleteImageByName: exports.deleteFileByName,
    deleteImagePath: exports.deleteImagePath,
    initializeDevelopmentDummyData: exports.initializeDevelopmentDummyData,
    createSuperAdmin: exports.createSuperAdmin,
    getPaginatedData: exports.getPaginatedData,
    saveFile: exports.saveFile,
    getUsername: exports.getUsername,
    deleteElementInArray: exports.deleteElementInArray,
    addElementToArray: exports.addElementToArray,
    capitalizeString: exports.capitalizeString,
    isProjectManager: exports.isProjectManager
};
exports.default = utils;
