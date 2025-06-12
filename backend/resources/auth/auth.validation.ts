import Joi from 'joi'

const register = Joi.object({
    firstName: Joi.string().max(30).required(),
    lastName: Joi.string().max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
})

const login = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
})

const verifyAccount = Joi.object({
    email: Joi.string().email().required(),
    otp: Joi.string().length(6).required(),
})

const refreshToken = Joi.object({
    refreshToken: Joi.string().required(),
})

const emailProvided = Joi.object({
    email: Joi.string().email().required(),
})

const resetPassword = Joi.object({
    password: Joi.string().min(8).required(),
    token: Joi.string().required(),
})

const changePassword = Joi.object({
    oldPassword: Joi.string().min(8).required(),
    newPassword: Joi.string().min(8).required(),
})

const updateProfile = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    about: Joi.string().required(),
    linkedIn: Joi.string().required(),
    facebook: Joi.string().required(),
    twitter: Joi.string().required(),
    username: Joi.string().required(),
    profession: Joi.string().required(),
    town: Joi.string().required(),
    gender: Joi.string().required(),
})

const updateGeneralSettings = Joi.object({
    region: Joi.string().required(),
    language: Joi.string().required(),
    timezone: Joi.string().required(),
    twelveHourFormat: Joi.boolean().required(),
})

const updateNotificationSettings = Joi.object({
    dailyNewsletter: Joi.boolean().required(),
    message: Joi.boolean().required(),
    projectUpdate: Joi.boolean().required(),
    projectDeadline: Joi.boolean().required(),
})

export default {
    register,
    login,
    verifyAccount,
    refreshToken,
    emailProvided,
    resetPassword,
    changePassword,
    updateProfile,
    updateGeneralSettings,
    updateNotificationSettings
}
