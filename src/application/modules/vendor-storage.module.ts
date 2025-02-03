import { Module } from '@nestjs/common';
import { S3Storage } from '../../infra/services/storage/aws/s3.service';
import { VendorStorageController } from '../controller/vendor-storage.controller';
import GetPresignedURLUseCase from '../../domain/use-case/get-presigned-url.use-case';

@Module({
  imports: [],
  controllers: [VendorStorageController],
  providers: [
    {
      provide: 'StorageServiceToken',
      useFactory: () => {
        return new S3Storage({
          endpoint: process.env.S3_ENDPOINT,
          accessKeyId: process.env.AWS_ACCESS_KEY_ID,
          region: process.env.AWS_REGION,
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        });
      },
    },
    {
      provide: 'GetPresignedURLUseCaseToken',
      useFactory: (storageService: S3Storage) => {
        return new GetPresignedURLUseCase(storageService);
      },
      inject: ['StorageServiceToken'],
    },
  ],
})
export class VendorStorageModule {}
