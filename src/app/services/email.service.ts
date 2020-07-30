import * as nodemailer from 'nodemailer';
import { Transporter } from 'nodemailer';
import { environment } from '../../environments/environment';

export class EmailService {

  private static transporter: Transporter;

  public static start() {
    EmailService.transporter = nodemailer.createTransport(
      {
        host: environment.smtp.host,
        port: environment.smtp.port,
        secure: false,
        auth: {
            user: environment.smtp.email,
            pass: environment.smtp.password
        },
        tls: { rejectUnauthorized: false }
      }
    );
  }

  public static async send(to: string[], subject: string, html: string): Promise<void> {
    try {
      await EmailService.transporter.sendMail({ to, subject, html });
    }
    catch (error) {
      console.error(error);
    }
  }

}
