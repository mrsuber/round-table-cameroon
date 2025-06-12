import Joi from 'joi'

const initiateDonation = Joi.object({
    purpose: Joi.string().required(),
    description: Joi.string().required(),
    amount: Joi.number().required(),
    payerNumber: Joi.string().required(),
    donatedBy: Joi.string().required(),
})

export default {
    initiateDonation,
}
