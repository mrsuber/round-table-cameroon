import express, { Application, NextFunction, Request, Response } from 'express'
import mongoose from 'mongoose'
import compression from 'compression'
import cors from 'cors'
import morgan from 'morgan'
import helmet from 'helmet'
import fileUpload from 'express-fileupload'
import path from 'path'
import { Server } from 'http'

import Controller from '@/utils/interfaces/controller.interface'
import ErrorMiddleware from '@/middleware/error.middleware'
import { initializeDevelopmentDummyData, createSuperAdmin } from '@/utils/helper/utils'
import { FILE_STRUCTURE } from './utils/helper/constants'

class App {
    public express: Application
    public httpServer: Server
    public port: number

    constructor(controllers: Controller[], port: number, express: Application, httpServer: Server) {
        this.express = express
        this.httpServer = httpServer
        this.port = port

        this.initializeMiddleware()
        this.initializeControllers(controllers)
        this.initializeErrorHandling()
        this.initializeLinks()
        this.initializeDatabaseConnectionAndStartApp()
    }

    private initializeMiddleware(): void {
        this.express.use(helmet({
            contentSecurityPolicy: {
                directives: {
                    defaultSrc: ["'self'"],
                    connectSrc: ["'self'", 'http://127.0.0.1:3000']
                }
            }
        }))
        this.express.use(cors())
        this.express.use(morgan('dev'))
        this.express.use(express.json())
        this.express.use(express.urlencoded({ extended: true }))
        this.express.use(compression())
        this.express.use(fileUpload())
        this.express.use((req: Request, res: Response, next: NextFunction) => {
            res.header(
                'Access-Control-Allow-Headers',
                'authorization, Origin, Content-Type, Accept'
            )
            next()
        })
    }

    private initializeControllers(controllers: Controller[]): void {
        controllers.forEach((controller) => {
            this.express.use('/api', controller.router)
        })
    }

    private initializeErrorHandling(): void {
        this.express.use(ErrorMiddleware)
    }

    private initializeLinks(): void {
        //on production
        if (process.env.NODE_ENV === 'production') {
            this.express.use(express.static(FILE_STRUCTURE.CLIENT_BUILD_PATH))
            this.express.use(express.static(FILE_STRUCTURE.PUBLIC_DIR))
            this.express.get('*', (req: Request, res: Response) => {
                res.sendFile(
                    path.join(FILE_STRUCTURE.CLIENT_BUILD_PATH, 'index.html')
                )
            })
        } else {
            this.express.get('/', (req: Request, res: Response) => {
                res.send('Round table Api running')
            })
        }
    }

    private async initializeDatabaseConnectionAndStartApp(): Promise<void> {
        try {
            await mongoose.connect(String(process.env.MONGO_URI)).then(async () => {
                await createSuperAdmin()
                this.httpServer.listen(process.env.PORT, () => {
                    console.log(
                        `Round table Server running on port http://localhost:${this.port} and on ${process.env.NODE_ENV} mode`
                    )
                })
            })
            if (process.env.NODE_ENV !== 'production') {
                await initializeDevelopmentDummyData()
            }
            console.log('round table MongoDB Connection Success 👍')
        } catch (err) {
            console.log('round table MongoDB Connection Failed 💥')
            process.exit(1)
        }
    }
}

export default App
