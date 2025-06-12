import Joi from 'joi'

const addSection = Joi.object({
    name: Joi.string().required(),
    projectId: Joi.string().required(),
})

const editSubtaskDetails = Joi.object({
    subtaskId: Joi.string().required(),
    description: Joi.string().required(),
})

const editTaskDetails = Joi.object({
    name: Joi.string().required(),
    priority: Joi.string().required(),
    description: Joi.string().required(),
    date: Joi.string().required(),
})

const changeTaskSection = Joi.object({
    newSectionId: Joi.string().required(),
    taskId: Joi.string().required(),
})

const removeTaskAssignee = Joi.object({
    taskId: Joi.string().required(),
    assigneeId: Joi.string().required(),
})

const removeSubtask = Joi.object({
    taskId: Joi.string().required(),
    subtaskId: Joi.string().required(),
})

const deleteAttachment = Joi.object({
    taskId: Joi.string().required(),
    filePath: Joi.string().required(),
})

export default {
    addSection,
    editSubtaskDetails,
    editTaskDetails,
    changeTaskSection,
    removeTaskAssignee,
    removeSubtask,
    deleteAttachment,
}
