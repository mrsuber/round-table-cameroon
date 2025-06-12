import path from 'path'
import { readdir, unlink } from 'fs/promises'
import { UploadedFile } from 'express-fileupload'

import { UserModel } from '@/resources/user'
import { Project } from '@/resources/project'
import { ROLES, STATUS_CODES, SUPER_ADMIN } from '@/utils/helper/constants'
import { paginationResult } from '@/utils/definitions/custom'
import HttpException from '@/utils/exceptions/http.exception'

export const findImageByName = async (directory: string, imageName: string) => {
    const files = await readdir(directory)

    for (const file of files) {
        if (file.split('.')[0] === imageName) {
            return file
        }
    }
}

export const deleteFileByName = async (
    directory: string,
    fileName: string
) => {
    const files = await readdir(directory)

    for (const file of files) {
        if (file.split('.')[0] === fileName) {
            try {
                await unlink(path.join(directory, file))
                console.log(`successfully deleted ${file}`)
            } catch (error: any) {
                console.error('there was an error:', error.message)
            }
        }
    }
}

export const deleteImagePath = async (path: string) => {
    await unlink(path)
}

export const initializeDevelopmentDummyData = async () => {
    let superAdmin = await UserModel.findOne({
        email: 'superadmin@roundtable.com',
    })
    if (!superAdmin) {
        // Add test super admin
        await new UserModel({
            firstName: 'Super',
            lastName: 'Admin',
            email: 'superadmin@roundtable.com',
            password: '12345678',
            isUser: true,
            isMember: true,
            role: ROLES.SUPER_ADMIN,
        }).save()
        // Add test members
        for (let i = 1; i <= 10; i++) {
            await new UserModel({
                firstName: 'Member',
                lastName: `Numero${i}`,
                email: `membernumero${i}@roundtable.com`,
                about: 'This is a test account',
                password: '12345678',
                isUser: true,
                isMember: true,
                role: ROLES.MEMBER,
            }).save()
        }
        // Add test users
        for (let i = 1; i <= 10; i++) {
            await new UserModel({
                firstName: 'User',
                lastName: `Numero${i}`,
                email: `usernumero${i}@roundtable.com`,
                about: 'This is a test account',
                password: '12345678',
                isUser: true,
                isMember: false,
                role: ROLES.USER,
            }).save()
        }
        console.log('All users added')
    }
}

export const createSuperAdmin = async () => {
    let superAdmin = await UserModel.findOne({
        email: SUPER_ADMIN.EMAIL,
    })

    if (superAdmin) {
        if (superAdmin.role !== ROLES.SUPER_ADMIN) {
            await UserModel.findByIdAndUpdate(superAdmin._id, {
                role: ROLES.SUPER_ADMIN,
                isMember: true,
                isUser: true,
            })
            console.log('Super admin role updated')
        } else {
            console.log('Super admin present')
        }
    } else {
        await new UserModel({
            firstName: SUPER_ADMIN.FIRST_NAME,
            lastName: SUPER_ADMIN.LAST_NAME,
            email: SUPER_ADMIN.EMAIL,
            password: SUPER_ADMIN.PASSWORD,
            isUser: true,
            isMember: true,
            role: ROLES.SUPER_ADMIN,
        }).save()
        console.log('Super admin has been added')
    }

}

export const getPaginatedData = async (
    pageNumber: number,
    pageLimit: number,
    model: any,
    findCondition: {},
    fields: string,
    sort: string
): Promise<paginationResult | Error> => {
    try {
        const startIndex = pageNumber * pageLimit
        const endIndex = (pageNumber + 1) * pageLimit

        const result: paginationResult = {
            total: 0,
            data: [],
            rowsPerPage: 0,
        }
        result.total = await model
            .find({ ...findCondition })
            .countDocuments()
            .exec()

        // Check if previous page exists and give page number
        if (startIndex > 0) {
            result.previous = {
                pageNumber: pageNumber - 1,
                pageLimit,
            }
        }

        // Check if next page exists and give page number
        if (endIndex < result.total) {
            result.next = {
                pageNumber: pageNumber + 1,
                pageLimit,
            }
        }

        result.data = await model
            .find({ ...findCondition }, fields)
            .sort(sort)
            .skip(startIndex)
            .limit(pageLimit)
            .exec()

        result.rowsPerPage = pageLimit

        return result
    } catch (error: any) {
        throw new Error(error.message)
    }
}

/**
 * Save file
 */
export const saveFile = (
    dir: string,
    file: UploadedFile
): string | Error => {
    try {
        let arr = file.name.split('.')
        let newFileName = `${arr[0]}___${Date.now() % 1000}.${arr[arr.length - 1]}`
        const filePath = path.join(dir, newFileName)
        file.mv(filePath, (err) => {
            if (err)
                throw new HttpException(
                    STATUS_CODES.ERROR.SERVER_ERROR,
                    'File upload failed'
                )
        })
        return filePath
    } catch (error: any) {
        throw new HttpException(
            error.status || STATUS_CODES.ERROR.SERVER_ERROR,
            error.message || 'Server error'
        )
    }
}

export const getUsername = async (userId: string) => {
    const user = await UserModel.findById(userId)
        .select('firstName lastName')
        .exec()
    return user?.firstName + ' ' + user?.lastName
}

export const deleteElementInArray = async (element: string, arr: any[]) => {
    for (let i = 0; i < arr.length; i++) {
        if (element === String(arr[i])) {
            arr.splice(i, 1)
            return
        }
    }
}

export const addElementToArray = async (element: string, arr: any[]) => {
    for (let i = 0; i < arr.length; i++) {
        if (element === String(arr[i])) {
            return
        }
    }
    arr.push(element)
}

export const capitalizeString = (string: string) => {
    const words = string.split(' ')

    const res = words
        .map((word) => {
            return word[0].toUpperCase() + word.substring(1)
        })
        .join(' ')
    return res
}

export const isProjectManager = (
    projectId: string,
    managedProjects: Project[]
): boolean => {
    for (let i = 0; i < managedProjects.length; i++) {
        if (String(managedProjects[i]) === projectId) {
            return true
        }
    }
    return false
}

const utils = {
    findImageByName,
    deleteImageByName: deleteFileByName,
    deleteImagePath,
    initializeDevelopmentDummyData,
    createSuperAdmin,
    getPaginatedData,
    saveFile,
    getUsername,
    deleteElementInArray,
    addElementToArray,
    capitalizeString,
    isProjectManager
}

export default utils
