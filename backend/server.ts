import 'dotenv/config'
import 'module-alias/register'

import http from 'http'
import express from 'express'

import App from './app'

import validateEnv from '@/utils/ValidateEnv'
import { ProjectController } from '@/resources/project'
import { UserController } from '@/resources/user'
import { ContactController } from '@/resources/contact'
import { MessageController } from '@/resources/message'
import { AuthController } from '@/resources/auth'
import { FileController } from '@/resources/file'
import { TaskController } from '@/resources/task'
import { DonationController } from '@/resources/donation'

validateEnv()

const expressServer = express()
const httpServer = http.createServer(expressServer)

new App(
    [
        new AuthController(),
        new ProjectController(),
        new UserController(),
        new ContactController(),
        new MessageController(httpServer),
        new FileController(),
        new TaskController(),
        new DonationController()
    ],
    Number(process.env.PORT),
    expressServer,
    httpServer
)
