import { Controller, Get, Post } from '@nestjs/common';

@Controller('app')
export class AppController {
  constructor() {}


  @Post('send-email')
  async sendEmail() {
    console.log('sendEmail');
    return 'sendEmail';
  }
}
