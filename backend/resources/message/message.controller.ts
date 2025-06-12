import { Router, Request, Response, NextFunction } from 'express'
import path from 'path'
import jwt from 'jsonwebtoken'
import { Server } from 'http'
import { writeFile } from 'fs'
import { Socket, Server as SocketServer } from 'socket.io'

import { verifyToken } from '@/utils/token'
import { Controller, Token } from '@/utils/interfaces'
import HttpException from '@/utils/exceptions/http.exception'
import { MessageService, Message } from '@/resources/message'
import { File, FileModel } from '@/resources/file'
import InMemorySessionStore from '@/utils/helper/sessionStore'
import {
    STATUS_CODES,
    FILE_STRUCTURE,
    PAGINATION,
    API_HOST,
    UPLOADS_SHORT_URL
} from '@/utils/helper/constants'
import { getUsername } from '@/utils/helper/utils'
import { authJwt } from '@/middleware/index'

class MessageController implements Controller {
    public path = '/messages'
    public router = Router()
    private messageService = new MessageService()
    public io: any
    public sessionStore: InMemorySessionStore

    constructor(httpServer: Server) {
        this.io = require('socket.io')(httpServer, {
            cors: {
                origin: 'http://localhost:3000',
            },
        })
        this.sessionStore = new InMemorySessionStore()
        this.initializeRoutes()
    }

    private initializeRoutes(): void {
        // For development purposes
        this.router.get(`${this.path}`, authJwt.isSuperAdmin, this.getMessages)
        this.router.get(`${this.path}/user-messages`, authJwt.isMember, this.getUserMessages)
        this.router.post(`${this.path}/delete-messages`, authJwt.isMember, this.deleteMessages)
        this.io
            .use(async (socket: any, next: NextFunction) => {
                if (socket.handshake.query && socket.handshake.query.token) {
                    console.log(socket.handshake.query.token)
                    try {
                        const payload: Token | jwt.JsonWebTokenError =
                            await verifyToken(
                                socket.handshake.query.token
                            )
                        if (payload instanceof jwt.JsonWebTokenError) {
                            return next(
                                new HttpException(
                                    401,
                                    'Unauthorised socket access'
                                )
                            )
                        }
                        // Store user id
                        socket.userID = payload.id
                    } catch (error) {
                        return next(
                            new HttpException(401, 'Authentication failed')
                        )
                    }
                } else {
                    return next(
                        new HttpException(401, 'Authentication query not found')
                    )
                }
                try {
                    const userId = socket.userID
                    const session = this.sessionStore.findSession(userId)
                    if (session) {
                        socket.username = session.username
                    } else {
                        const username = await getUsername(userId)
                        socket.username = username
                    }
                    next()
                } catch (error) {
                    return next(new HttpException(500, 'Failed to get session'))
                }
            })
            .on('connection', async (socket: any) => {
                try {
                    // persist session
                    this.sessionStore.saveSession(socket.userID, {
                        userID: socket.userID,
                        username: socket.username,
                        connected: true,
                    })

                    // emit session details
                    socket.emit('session', {
                        username: socket.username,
                        userID: socket.userID,
                    })

                    // join the "userID" room
                    socket.join(socket.userID)

                    // retrieve messages
                    const messagesPerUser: Map<string, []> =
                        (await this.messageService.fetchMessages(
                            socket.userID
                        )) as Map<string, []>

                    // fetch existing users
                    const users: any = []
                    this.sessionStore.findAllSessions().forEach((session) => {
                        users.push({
                            userID: session.userID,
                            username: session.username,
                            connected: session.connected,
                            messages: messagesPerUser.get(session.userID) || [],
                            self: socket.userID === session.userID,
                        })
                    })
                    socket.emit('users', users)

                    // notify existing users
                    socket.broadcast.emit('user connected', {
                        userID: socket.userID,
                        username: socket.username,
                        connected: true,
                        messages: [],
                    })

                    // forward the private message to the right recipient (and to other tabs of the sender)
                    socket.on(
                        'private message',
                        async ({
                            content,
                            to,
                        }: {
                            content: any
                            to: string
                        }) => {
                            console.log('backend content', content, to)
                            if (!to) return
                            try {
                                const { text, files } = content
                                const messageFiles = []
                                for (let i = 0; i < files.length; i++) {
                                    let fileData = files[i];
                                    const arr = fileData.name.split('.')
                                    const ext = arr[arr.length - 1]
                                    // Add random integer to file name
                                    let newFileName = `${arr[0]}___${Date.now() % 1000}.${ext}`
                                    const filePath = path.join(FILE_STRUCTURE.MESSAGE_FILES_DIR, newFileName)
                                    writeFile(
                                        filePath,
                                        fileData.file,
                                        (err) => {
                                            console.log(err)
                                        }
                                    )
                                    let newFile = await new FileModel({
                                        httpPath: ext,
                                        dirPath: filePath,
                                        name: fileData.name,
                                        size: fileData.size,
                                        mimetype: fileData.mimetype,
                                        uploadedBy: socket.userID
                                    }).save()
                                    messageFiles.push(newFile as File)
                                }
                                const message = {
                                    content: text,
                                    from: socket.userID as string,
                                    to,
                                    files: messageFiles,
                                } as Message
                                this.messageService.saveMessage(message)
                                for (let j = 0; j < messageFiles.length; j++) {
                                    let messageFile = messageFiles[j]
                                    messageFile.dirPath = undefined as unknown as string
                                    messageFile.deleted = undefined as unknown as boolean
                                    messageFile.httpPath = API_HOST + UPLOADS_SHORT_URL + String(messageFile._id) + '.' + messageFile.httpPath
                                }
                                socket
                                    .to(to)
                                    .to(socket.userID)
                                    .emit('private message', message)
                            } catch (error) {
                                socket
                                    .to(socket.userID)
                                    .emit('private message', {
                                        content: 'MESSAGE NOT SENT',
                                        to: to,
                                        from: socket.userID,
                                    })
                            }
                        }
                    )

                    // notify users upon disconnection
                    socket.on('disconnect', async () => {
                        const matchingSockets = await this.io
                            .in(socket.userID)
                            .allSockets()
                        const isDisconnected = matchingSockets.size === 0
                        if (isDisconnected) {
                            // notify other users
                            socket.broadcast.emit(
                                'user disconnected',
                                socket.userID
                            )
                            // update the connection status of the session
                            this.sessionStore.saveSession(socket.userID, {
                                userID: socket.userID,
                                username: socket.username,
                                connected: false,
                            })
                        }
                    })
                } catch (error: any) {
                    throw new HttpException(
                        error.status || STATUS_CODES.ERROR.SERVER_ERROR,
                        error.message || 'Server error'
                    )
                }
            })
    }

    private getMessages = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const result = await this.messageService.getMessages(req)
            res.status(STATUS_CODES.SUCCESS.SUCCESSFUL_REQUEST).json({ result })
        } catch (error: any) {
            next(new HttpException(error.status, error.message))
        }
    }

    private getUserMessages = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const messages = await this.messageService.getUserMessages(req)
            res.status(STATUS_CODES.SUCCESS.SUCCESSFUL_REQUEST).json({ messages })
        } catch (error: any) {
            next(new HttpException(error.status, error.message))
        }
    }

    private deleteMessages = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            await this.messageService.deleteMessages(req)
            res.status(STATUS_CODES.SUCCESS.SUCCESSFUL_REQUEST).json({
                success: true,
            })
        } catch (error: any) {
            next(new HttpException(error.status, error.message))
        }
    }
}

export default MessageController
