import { Module } from '@nestjs/common';
import { createTransport, Transporter } from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

export type TEmailTransport = Transporter<
  SMTPTransport.SentMessageInfo,
  SMTPTransport.Options
>;

@Module({
  providers: [
    {
      provide: 'EmailTransportToken',
      useFactory(): TEmailTransport {
        return createTransport({
          host: process.env.MAIL_HOST,
          port: Number(process.env.MAIL_PORT),
          secure: false, // true for 465, false for other ports
          auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS,
          },
        });
      },
    },
  ],
  exports: ['EmailTransportToken'],
})
export class EmailModule {}