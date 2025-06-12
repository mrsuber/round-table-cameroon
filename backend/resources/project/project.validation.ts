import Joi from 'joi'

const addProject = Joi.object({
    title: Joi.string().required(),
    managerId: Joi.string().required(),
})

const toggleProjectStatus = Joi.object({
    projectId: Joi.string().required(),
})

const addContributors = Joi.object({
    projectId: Joi.string().required(),
    contributorId: Joi.array().required(),
})

const removeContributor = Joi.object({
    projectId: Joi.string().required(),
    contributorId: Joi.string().required(),
})

const editProject = Joi.object({
    publicProject: Joi.bool().required(),
    title: Joi.string().required(),
    date: Joi.string().required(),
    ongoing: Joi.bool().required(),
    description: Joi.string().required(),
    labels: Joi.array().required(),
    projectId: Joi.string().required(),
})

const addManager = Joi.object({
    projectId: Joi.string().required(),
    managerId: Joi.string().required(),
})

const removeAttachment = Joi.object({
    projectId: Joi.string().required(),
    filepath: Joi.string().required(),
})

export default {
    addProject,
    toggleProjectStatus,
    addContributors,
    removeContributor,
    editProject,
    addManager,
    removeAttachment,
}
