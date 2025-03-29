// src/services/email.service.ts
import { Injectable } from '@nestjs/common';
const Mailjet = require('node-mailjet');
import { getTemplateContent, replaceContent } from 'src/utils/common.utils';

@Injectable()
export class EmailService {
  private readonly mailjetClient: any;
  private readonly fromAddress: string;
  private readonly fromName: string;

  constructor() {
    this.mailjetClient = new Mailjet({
      apiKey: process.env.MAILJET_API_KEY,
      apiSecret: process.env.MAILJET_SECRET_KEY,
    });
    this.fromAddress = process.env.MAILJET_FROM_ADDRESS;
    this.fromName = process.env.MAILJET_FROM_NAME;
  }

  async sendEmail(
    email: string,
    title: string,
    templateName: string,
    param: Record<string, any>,
  ): Promise<boolean> {
    const template = getTemplateContent(templateName);
    const content = replaceContent(template, param);

    const recipients = [
      {
        Email: email,
        Name: email,
      },
    ];

    return this.doSendMail(recipients, title, content, content);
  }

  private async doSendMail(
    recipients: { Email: string; Name: string }[],
    subject: string,
    message: string,
    htmlBody: string,
  ): Promise<boolean> {
    try {
      const request = {
        Messages: [
          {
            From: {
              Email: this.fromAddress,
              Name: this.fromName,
            },
            To: recipients,
            Subject: subject,
            TextPart: message,
            HTMLPart: htmlBody,
          },
        ],
      };

      const response = await this.mailjetClient.post('send', { version: 'v3.1' }).request(request);
      
      if (response.body.Messages[0].Status !== 'success') {
        console.error('Email sending failed:', response.body);
        return false;
      }

      console.log('Email sent successfully');
      return true;
    } catch (error) {
      console.error('Error while sending email:', error);
      return false;
    }
  }

}
