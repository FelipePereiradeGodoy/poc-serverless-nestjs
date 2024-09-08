import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ProductModule } from './application/modules/product.module';

@Module({
  imports: [ProductModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
