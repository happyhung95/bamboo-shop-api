import { Request, Response, NextFunction } from 'express'
import nodemailer from 'nodemailer'

import { InternalServerError } from '../../helpers/apiError'
import { UserDocument } from '../../models/User'
import { ETHEREAL_USER_SECRET, ETHEREAL_PASSWORD_SECRET } from '../../util/secrets'

//! require token in response header and req.user
//! send email and remove token from response header
export default async function (req: Request, res: Response, next: NextFunction) {
  try {
    let token = res.get('Authorization')

    // Remove 'Bearer ' from token
    if (token.startsWith('Bearer ')) {
      token = token.slice(7, token.length).trimLeft()
    }

    const resetLink = `http://localhost:3000/api/v1/users/resetpassword/${token}` // frontend link

    const { email: recipientEmail } = req.user as UserDocument

    // Test SMTP service account from ethereal.email for testing,
    // No email is actually sent, check from ethereal mailbox
    const transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: ETHEREAL_USER_SECRET,
        pass: ETHEREAL_PASSWORD_SECRET,
      },
    })

    const message = {
      from: '"Test Bamboo Shop" <no-reply@bambooshop.com>',
      to: recipientEmail,
      subject: '[No-reply] Reset password link  ',
      text: resetLink,
    }

    transporter.sendMail(message)

    // remove token from header
    res.set('Authorization', undefined)
    next()
  } catch (error) {
    next(new InternalServerError('Internal Server Error', error))
  }
}
