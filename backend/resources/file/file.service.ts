import { Request } from 'express'

import { File, FileModel } from '@/resources/file'
import { STATUS_CODES, API_HOST, UPLOADS_SHORT_URL } from '@/utils/helper/constants'
import HttpException from '@/utils/exceptions/http.exception'

class ProjectService {
    /**
     * Get a file by it's id
     */
    public async getFile(req: Request, isAdmin: boolean): Promise<File | Error> {
        try {
            const fileId = req.params.fileId
            let fileIdParts = fileId.split('.')
            const file = await FileModel.findOne(isAdmin ? { _id: fileIdParts[0] } : { _id: fileIdParts[0], deleted: false }).exec()
            if (!file) {
                throw new HttpException(
                    STATUS_CODES.ERROR.NOT_FOUND,
                    'File not found'
                )
            }
            return file
        } catch (error: any) {
            throw new HttpException(
                error.status || STATUS_CODES.ERROR.SERVER_ERROR,
                error.message || 'Server error'
            )
        }
    }

    /**
     * Get saved files
     */
    public async getFiles(): Promise<object | Error> {
        try {
            const result = await FileModel.find().exec()
            for (let i = 0; i < result.length; i++) {
                let file = result[i]
                file.dirPath = undefined as unknown as string
                file.httpPath = API_HOST + UPLOADS_SHORT_URL + 'admin/' + String(file._id) + '.' + file.httpPath
            }
            return result
        } catch (error: any) {
            throw new HttpException(
                error.status || STATUS_CODES.ERROR.SERVER_ERROR,
                error.message || 'Server error'
            )
        }
    }
}

export default ProjectService
