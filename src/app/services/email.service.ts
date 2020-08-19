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
      await EmailService.transporter.sendMail({ from, to, subject, html, text: EmailService.htmlToText(html) });
    }
    catch (error) {
      throw error;
    }
  }

  private static htmlToText(html: string): string {
    return html.replace(/<style([\s\S]*?)<\/style>/gi, '')
    .replace(/<script([\s\S]*?)<\/script>/gi, '')
    .replace(/<\/div>/ig, '\n')
    .replace(/<\/li>/ig, '\n')
    .replace(/<li>/ig, ' - ')
    .replace(/<\/ul>/ig, '\n')
    .replace(/<\/p>/ig, '\n')
    .replace(/<br\s*[\/]?>/gi, '\n')
    .replace(/<[^>]+>/ig, '')
    .trim()
    .replace(/\s\s+/g, '\n');
  }

}
