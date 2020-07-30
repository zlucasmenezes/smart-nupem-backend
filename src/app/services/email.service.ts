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
        auth: environment.smtp.auth,
        tls: { rejectUnauthorized: false }
      }
    );
  }

  public static async send(from: string, to: string[], subject: string, html: string): Promise<void> {
    try {
      await EmailService.transporter.sendMail({ from, to, subject, html });
    }
    catch (error) {
      console.error(error);
    }
  }

}
