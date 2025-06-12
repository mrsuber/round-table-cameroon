require('dotenv').config()
const path = require('path')

export const FRONTEND_HOSTNAME = process.env.APP_HOST
export const MAIL_SETTINGS = {
    service: 'gmail',
    auth: {
        user: process.env.MAIL_EMAIL,
        pass: process.env.MAIL_PASSWORD,
    },
    port: 465,
    host: 'smtp.gmail.com',
}

export const ROLES = {
    SUPER_ADMIN: 'superAdmin',
    ADMIN: 'admin',
    MEMBER: 'member',
    USER: 'user',
}
export const AUTH_SETTINGS = {
    SALT_ROUNDS: 8,
    TOKEN_JWT_SECRET: process.env.TOKEN_JWT_SECRET,
    TOKEN_JWT_EXPIRY: process.env.TOKEN_JWT_EXPIRY,
    REFRESH_TOKEN_JWT_EXPIRY: process.env.REFRESH_TOKEN_JWT_EXPIRY,
    OTP_EXPIRY: process.env.OTP_EXPIRY,
    PASSWORD_TOKEN_EXPIRY: process.env.PASSWORD_TOKEN_EXPIRY,
    SECRET: process.env.SECRET,
}
export const FILE_STRUCTURE = {
    ROOT_DIRECTORY: process.cwd(),
    PUBLIC_DIR: path.join(process.cwd(), 'public'),
    USER_PROFILE_DIR: path.join(process.cwd(), 'public', 'userProfiles'),
    PARTNER_LOGO_DIR: path.join(process.cwd(), 'public', 'partnerLogos'),
    PROJECT_IMAGE_DIR: path.join(process.cwd(), 'public', 'projectImage'),
    PROJECT_ATTACHMENT_DIR: path.join(
        process.cwd(),
        'public',
        'projectAttachment'
    ),
    MESSAGE_FILES_DIR: path.join(process.cwd(), 'public', 'messageFiles'),
    CLIENT_BUILD_PATH: path.join(process.cwd(), 'client', 'build'),
}
export const OTP_CONFIG = {
    upperCaseAlphabets: false,
    lowerCaseAlphabets: false,
    digits: true,
    specialChars: false,
}
export const OTP_LENGTH = 6
export const API_HOST = process.env.APP_HOST
export const UPLOADS_SHORT_URL = '/api/uploads/'
export const STATUS_CODES = {
    ERROR: {
        MOVED_PERMANENTLY: 301,
        MOVED_TEMPORARILY: 302,
        BAD_REQUEST: 400,
        UNAUTHORIZED: 401,
        PAYMENT_REQUIRED: 402,
        FORBIDDEN: 403,
        NOT_FOUND: 404,
        METHOD_NOT_ALLOWED: 405,
        CONFLICT: 409,
        ACCOUNT_SUSPENDED: 410,
        UNSUPPORTED_MEDIA_FORMAT: 415,
        VALIDATION_ERRORS: 422,
        REQUEST_CONTROL: 429,
        SERVER_ERROR: 500,
    },
    SUCCESS: {
        SUCCESSFUL_REQUEST: 200,
        CREATED_SUCCESSFULLY: 201,
    },
}

export const PAGINATION = {
    DEFAULT_PAGE_NUMBER: 0,
    DEFAULT_PAGE_LIMIT: 6,
}

export const SUPER_ADMIN = {
    EMAIL: process.env.SUPER_ADMIN_EMAIL,
    PASSWORD: process.env.SUPER_ADMIN_PASSWORD,
    FIRST_NAME: process.env.SUPER_ADMIN_FIRST_NAME,
    LAST_NAME: process.env.SUPER_ADMIN_LAST_NAME,
}

export const JWT_INFO = {
    SECRET: process.env.JWT_SECRET,
    ACCESS_TOKEN_DUR: process.env.TOKEN_JWT_EXPIRY,
    REFRESH_TOKEN_DUR: process.env.REFRESH_TOKEN_JWT_EXPIRY,
    RESET_TOKEN_SECRET: process.env.RESET_TOKEN_SECRET,
}

export const DONATION_STATE = {
    INITIATED: 'INITIATED',
    PENDING: 'PENDING',
    SUCCESSFUL: 'SUCCESSFUL',
    FAILED: 'FAILED',
}

export const MOMO_SECRETS = {
    VALLET_PAY_CLIENT_SECRET: process.env.VALLET_PAY_CLIENT_SECRET,
    VALLET_PAY_CLIENT_SECRET_ID: process.env.VALLET_PAY_CLIENT_SECRET_ID,
    VALLET_PAY_BASE_URL: process.env.VALLET_PAY_BASE_URL,
    PERCENTAGE_COMMISION: 1,
    BENEFACTOR_MOMO_NUMBER: process.env.BENEFACTOR_MOMO_NUMBER,
}

const CONSTANTS = {
    FRONTEND_HOSTNAME,
    MAIL_SETTINGS,
    ROLES,
    AUTH_SETTINGS,
    FILE_STRUCTURE,
    OTP_CONFIG,
    OTP_LENGTH,
    STATUS_CODES,
    PAGINATION,
    API_HOST,
    UPLOADS_SHORT_URL,
    SUPER_ADMIN,
    JWT_INFO,
    DONATION_STATE,
    MOMO_SECRETS,
}

export default CONSTANTS
