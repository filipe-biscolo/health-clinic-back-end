import { Request, Response } from "express";
// import Mail from "../services/mail";


import * as nodemailer from "nodemailer";
import config from '../config/mail_config';

export default {
    // async create(request: Request, response: Response) {
    //     const message = Object.assign({}, request.body);     
            
    //     Mail.to = message.to;
    //     Mail.subject = message.subject;
    //     Mail.message = message.message;
    //     let result = await Mail.sendMail();

    //     response.status(200).json({ 'result': result })
    // },


    async create(request: Request, response: Response) {
        const message = Object.assign({}, request.body); 
        
        const mailOptions = {
            from: "filipe_biskolo@gmail.com",
            to: message.to,
            subject: message.subject,
            html: message.message
        };

        const transporter = await nodemailer.createTransport({
            host: config.host,
            port: config.port,
            secure: false,
            auth: {
                user: config.user,
                pass: config.password
            },
            tls: { rejectUnauthorized: false }
        });

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                response.status(500).json({ 'result': error })
            } else {
                response.status(200).json({ 'result': "E-mail enviado com sucesso!" })
            }
        });

        
    }
}