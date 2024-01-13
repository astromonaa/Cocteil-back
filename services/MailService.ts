import nodemailer from 'nodemailer'

class MailService {
  #transporter: any;

  constructor() {
    this.#transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: 465,
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });
  }

  async sendActivationLink(to:string, activationLink:string) {

    activationLink = `${process.env.HOST}/api/users/activate/${activationLink}`
    try {
      await this.#transporter.sendMail({
        from: '"Fred Foo 👻" <foo@example.com>', // sender address
        to, // list of receivers
        subject: "Hello ✔", // Subject line
        html: `
          <b>${activationLink}</b>
        `
      })
    }catch(e) {
      console.log(e);
      
      throw new Error('Error while sending mail')
    }
  }
  
}

export default new MailService()