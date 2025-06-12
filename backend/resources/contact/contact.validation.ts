import Joi from 'joi'

const createForm = Joi.object({
    fullNames: Joi.string().required(),
    email: Joi.string().email().required(),
    message: Joi.string().required(),
})

const addPartner = Joi.object({
    name: Joi.string().required(),
    moreInfo: Joi.string().required(),
})

const emailProvided = Joi.object({
    email: Joi.string().email().required(),
})

export default { createForm, addPartner, emailProvided }
