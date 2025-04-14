import nodemailer from 'nodemailer'
import { env } from './env'

export const mailTransporter = nodemailer.createTransport({ 
  	host: env.SMTP_HOST, 
  	port: parseInt(env.SMTP_PORT), 
  	auth: { 
  		user: env.SMTP_USER, 
  		pass: env.SMTP_PASSWORD
  	} 
}) 