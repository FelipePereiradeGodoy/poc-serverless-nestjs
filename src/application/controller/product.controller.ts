import { Controller, Inject } from '@nestjs/common';
import { S3Event } from 'aws-lambda';
import SendProductsToRegisterQueueUseCase from '../../domain/use-case/send-products-to-register.use-case';

@Controller('product')
export class ProductController {
  constructor(
    @Inject('SendProductsToRegisterQueueUseCaseToken')
    private sendProductsToRegisterQueueUseCase: SendProductsToRegisterQueueUseCase,
  ) {}

  async SendProductsToRegisterQueue(event: S3Event) {
    await this.sendProductsToRegisterQueueUseCase.execute({
      bucketName: event.Records[0].s3.bucket.name,
      fileName: event.Records[0].s3.object.key,
    });
  }
}
