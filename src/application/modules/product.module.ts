import { Module } from '@nestjs/common';
import { ProductController } from '../controller/product.controller';
import SendProductsToRegisterQueueUseCase from '../../domain/use-case/send-products-to-register.use-case';
import { SQSService } from '../../infra/services/message/aws/sqs.service';
import { S3Storage } from '../../infra/services/storage/aws/s3.service';

@Module({
  imports: [],
  controllers: [ProductController],
  providers: [
    {
      provide: 'StorageServiceToken',
      useFactory: () => {
        // Esses valores devem ser substituídos durante os testes
        return new S3Storage({
          endpoint: process.env.S3_ENDPOINT,
          accessKeyId: process.env.AWS_ACCESS_KEY_ID,
          region: process.env.AWS_REGION,
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        });
      },
    },
    {
      provide: 'MessageServiceToken',
      useFactory: () => {
        // Esses valores devem ser substituídos durante os testes
        return new SQSService({
          endpoint: process.env.SQS_ENDPOINT,
          accessKeyId: process.env.AWS_ACCESS_KEY_ID,
          region: process.env.AWS_REGION,
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        });
      },
    },
    {
      provide: 'SendProductsToRegisterQueueUseCaseToken',
      useFactory: (storageService: S3Storage, messageService: SQSService) => {
        return new SendProductsToRegisterQueueUseCase(
          storageService,
          messageService,
        );
      },
      inject: ['StorageServiceToken', 'MessageServiceToken'],
    },
  ],
})
export class ProductModule {}
