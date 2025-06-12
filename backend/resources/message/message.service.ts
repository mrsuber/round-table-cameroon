import { Request } from 'express'

import { Message, MessageModel } from '@/resources/message'
import HttpException from '@/utils/exceptions/http.exception'
import { STATUS_CODES, API_HOST, UPLOADS_SHORT_URL, PAGINATION } from '@/utils/helper/constants'
import { paginationResult } from '@/utils/definitions/custom'
import { FileModel } from '@/resources/file'

class MessageService {
    /**
     * Fetch user's messages
     */
    public async fetchMessages(
        userId: string
    ): Promise<Map<string, []> | Error> {
        try {
            const messagesPerUser = new Map()
            const messages: Message[] = await MessageModel.find({
                $or: [{ from: userId }, { to: userId }],
            }).populate('files').exec()
            for (let i = 0; i < messages.length; i++) {
                let message = messages[i]
                for (let j = 0; j < message.files.length; j++) {
                    let messageFile = message.files[j]
                    messageFile.dirPath = undefined as unknown as string
                    messageFile.deleted = undefined as unknown as boolean
                    messageFile.httpPath = API_HOST + UPLOADS_SHORT_URL + String(messageFile._id) + '.' + messageFile.httpPath
                }
                const { from, to, deletedByReceiver } = message
                if (deletedByReceiver && userId === to) {
                } else {
                    const otherUser = userId === from ? to : from
                    if (messagesPerUser.has(otherUser)) {
                        messagesPerUser.get(otherUser).push(message)
                    } else {
                        messagesPerUser.set(otherUser, [message])
                    }
                }
            }
            return messagesPerUser
        } catch (error: any) {
            throw new HttpException(
                error.status || STATUS_CODES.ERROR.SERVER_ERROR,
                error.message || 'Server error'
            )
        }
    }

    /**
     * Save message
     */
    public async saveMessage(message: Message): Promise<void | Error> {
        try {
            await new MessageModel({
                content: message.content,
                to: message.to,
                from: message.from,
                files: message.files.map(file => file._id),
            }).save()
        } catch (error: any) {
            throw new HttpException(
                error.status || STATUS_CODES.ERROR.SERVER_ERROR,
                error.message || 'Server error'
            )
        }
    }

    public async getMessages(req: Request): Promise<paginationResult | Error> {
        const pageNumber =
            parseInt(req.query.pageNumber as string) ||
            PAGINATION.DEFAULT_PAGE_NUMBER
        const pageLimit =
            parseInt(req.query.limit as string) ||
            PAGINATION.DEFAULT_PAGE_LIMIT
        try {
            const startIndex = pageNumber * pageLimit
            const endIndex = (pageNumber + 1) * pageLimit

            const result: paginationResult = {
                total: 0,
                data: [],
                rowsPerPage: 0,
            }
            result.total = await MessageModel
                .find()
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

            result.data = await MessageModel
                .find()
                .sort('createdAt')
                .skip(startIndex)
                .limit(pageLimit)
                .populate('files')
                .exec()

            result.rowsPerPage = pageLimit

            for (let i = 0; i < result.data.length; i++) {
                let message = result.data[i]
                for (let j = 0; j < message.files.length; j++) {
                    let messageFile = message.files[j]
                    messageFile.dirPath = undefined as unknown as string
                    messageFile.httpPath = API_HOST + UPLOADS_SHORT_URL + String(messageFile._id) + '.' + messageFile.httpPath
                }
            }

            return result
        } catch (error: any) {
            throw new HttpException(
                error.status || STATUS_CODES.ERROR.SERVER_ERROR,
                error.message || 'Server error'
            )
        }
    }

    public async getUserMessages(req: Request): Promise<object | Error> {
        try {
            const userId = req.user._id
            const result = await this.fetchMessages(userId) as Map<string, []>
            const messages = Object.fromEntries(result)
            return messages;
        } catch (error: any) {
            throw new HttpException(
                error.status || STATUS_CODES.ERROR.SERVER_ERROR,
                error.message || 'Server error'
            )
        }
    }

    public async deleteMessages(req: Request): Promise<void | Error> {
        const { messageIds } = req.body
        const userId = String(req.user._id)
        try {
            messageIds.forEach((messageId: string) =>
                this.deleteMessage(userId, messageId)
            )
        } catch (error: any) {
            throw new HttpException(
                error.status || STATUS_CODES.ERROR.SERVER_ERROR,
                error.message || 'Server error'
            )
        }
    }

    public async deleteMessage(
        userId: string,
        messageId: string
    ): Promise<void | Error> {
        try {
            const message = await MessageModel.findById(messageId)
                .select('files from to deletedByReceiver')
                .exec()
            if (message) {
                if (userId === message?.from) {
                    await MessageModel.findByIdAndDelete(messageId).exec()
                    for (let i = 0; i < message.files.length; i++) {
                        await FileModel.findByIdAndUpdate(message.files[i], {
                            deleted: true
                        })
                    }
                    console.log('Message deleted')
                } else if (userId === message?.to) {
                    if (message.deletedByReceiver) {
                        console.log('Message already deleted for receiver')
                    } else {
                        await MessageModel.findByIdAndUpdate(messageId, {
                            deletedByReceiver: true,
                        })
                        console.log('Message deleted for receiver')
                    }
                } else {
                    console.log('Unauthorized user')
                }
            } else {
                console.log('Message not found')
            }
        } catch (error: any) {
            throw new HttpException(
                error.status || STATUS_CODES.ERROR.SERVER_ERROR,
                error.message || 'Server error'
            )
        }
    }
}

export default MessageService
