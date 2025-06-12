import { cleanEnv, str, port, email, num } from 'envalid'

const validateEnv = (): void => {
    cleanEnv(process.env, {
        // Required
        NODE_ENV: str({
            choices: ['development', 'production'],
        }),
        MONGO_URI: str(),
        MAIL_EMAIL: email(),
        MAIL_PASSWORD: str(),
        JWT_SECRET: str(),
        SUPER_ADMIN_EMAIL: str(),
        SUPER_ADMIN_PASSWORD: str(),
        SUPER_ADMIN_FIRST_NAME: str(),
        SUPER_ADMIN_LAST_NAME: str(),
        APP_HOST: str(),
        RESET_TOKEN_SECRET: str(),
        VALLET_PAY_CLIENT_SECRET: str(),
        VALLET_PAY_CLIENT_SECRET_ID: str(),
        VALLET_PAY_BASE_URL: str(),
        BENEFACTOR_MOMO_NUMBER: str(),

        // Not Required
        PORT: port({ default: 8080 }),
        TOKEN_JWT_EXPIRY: num({ default: 1800 }),
        REFRESH_TOKEN_EXPIRY: num({ default: 172800 }),
        OTP_EXPIRY: num({ default: 60 }),
        MOMO_ENV: str({ default: 'sandbox' }),
    })
}

export default validateEnv
