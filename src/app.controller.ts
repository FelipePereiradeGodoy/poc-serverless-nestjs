import { Controller, Get, Post } from '@nestjs/common';

@Controller('app')
export class AppController {
  constructor() {}

  @Get('get-presigned-url')
  async getPresignedURL() {
    console.log('getPresignedURL');
    return 'getPresignedURL';
  }

  @Post('send-email')
  async sendEmail() {
    console.log('sendEmail');
    return 'sendEmail';
  }
}
