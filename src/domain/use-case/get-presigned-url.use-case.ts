import { S3Storage } from 'src/infra/services/storage/aws/s3.service';

export default class GetPresignedURLUseCase {
  constructor(private storageService: S3Storage) {}

  async execute(bucketName: string, fileName: string): Promise<string> {
    const url = await this.storageService.createPresignedUrl(
      bucketName,
      fileName,
    );

    return url;
  }
}
