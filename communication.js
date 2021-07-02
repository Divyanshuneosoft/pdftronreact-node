const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');
class Communicate{
    async nodemailer(options) {
        this.mailer = nodemailer
        this.mailer = this.mailer.createTransport(smtpTransport({
            host: "mail.neosoftmail.com",
            port: 587,
            secure: false,
            ignoreTLS: true,
            auth: {
                user:"divyanshu.agarwal@neosoftmail.com",
                pass: "PPmf)JvBljjZ"
            },
            connectionTimeout: 5 * 60 * 1000,
            tls: {
                rejectUnauthorized: false
            }
        }))
        try {
            let response = await this.mailer.sendMail(options)
        } catch (error) {
            console.log("MailProvider -> nodemailer -> error", error)
            throw error
        }
    }
    async sendEmail(data){
        try {
            let options = {
                from:'divyanshu.agarwal@neosoftmail.com',
                to: data.email,
                subject:data.subject,
                html:`<h5>Hello ${data.name}</h5><p>${data.message}</p>`
            }
            await this.nodemailer(options)
        } catch (error) {
            console.log("MailProvider -> nodemailer -> error", error)
            throw error
        }
    }
}
module.exports = new Communicate()