"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const envalid_1 = require("envalid");
const validateEnv = () => {
    (0, envalid_1.cleanEnv)(process.env, {
        // Required
        NODE_ENV: (0, envalid_1.str)({
            choices: ['development', 'production'],
        }),
        MONGO_URI: (0, envalid_1.str)(),
        MAIL_EMAIL: (0, envalid_1.email)(),
        MAIL_PASSWORD: (0, envalid_1.str)(),
        JWT_SECRET: (0, envalid_1.str)(),
        SUPER_ADMIN_EMAIL: (0, envalid_1.str)(),
        SUPER_ADMIN_PASSWORD: (0, envalid_1.str)(),
        SUPER_ADMIN_FIRST_NAME: (0, envalid_1.str)(),
        SUPER_ADMIN_LAST_NAME: (0, envalid_1.str)(),
        APP_HOST: (0, envalid_1.str)(),
        RESET_TOKEN_SECRET: (0, envalid_1.str)(),
        VALLET_PAY_CLIENT_SECRET: (0, envalid_1.str)(),
        VALLET_PAY_CLIENT_SECRET_ID: (0, envalid_1.str)(),
        VALLET_PAY_BASE_URL: (0, envalid_1.str)(),
        BENEFACTOR_MOMO_NUMBER: (0, envalid_1.str)(),
        // Not Required
        PORT: (0, envalid_1.port)({ default: 8080 }),
        TOKEN_JWT_EXPIRY: (0, envalid_1.num)({ default: 1800 }),
        REFRESH_TOKEN_EXPIRY: (0, envalid_1.num)({ default: 172800 }),
        OTP_EXPIRY: (0, envalid_1.num)({ default: 60 }),
        MOMO_ENV: (0, envalid_1.str)({ default: 'sandbox' }),
    });
};
exports.default = validateEnv;
