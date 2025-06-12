import nodemailer from 'nodemailer'

import { MAIL_SETTINGS, STATUS_CODES } from '@/utils/helper/constants'
import {
    signUpSuccessTemplate,
    forgottenPasswordTemplate,
} from '@/utils/mailTemplates'
import HttpException from '@/utils/exceptions/http.exception'
import { mailParams } from '@/utils/definitions/custom'

const transporter = nodemailer.createTransport(MAIL_SETTINGS)

export const sendMail = async (params: mailParams) => {
    try {
        let info = await transporter.sendMail({
            from: MAIL_SETTINGS.auth.user,
            to: params.email,
            subject:
                params.verification === true
                    ? 'Account Registration Details'
                    : 'Reset Password Request',
            html: params.verification
                ? signUpSuccessTemplate({
                      email: params.email as string,
                      otpCode: params.otpCode as string,
                      firstName: params.firstName,
                      lastName: params.lastName,
                  })
                : forgottenPasswordTemplate({
                      verificationCode: params.otpCode,
                      firstName: params.firstName,
                      lastName: params.lastName,
                  }),
        })
        return info
    } catch (error: any) {
        throw new HttpException(
            error.status || STATUS_CODES.ERROR.SERVER_ERROR,
            error.message || 'Server error, could not send mail'
        )
    }
}
