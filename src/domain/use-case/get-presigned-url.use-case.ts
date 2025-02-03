import { S3Storage } from 'src/infra/services/storage/aws/s3.service';

export type TGetPresignedURLUseCaseInputDTO = {
  bucketName: string;
  fileName: string;
};
export default class GetPresignedURLUseCase {
  constructor(private storageService: S3Storage) {}

  async execute(payload: TGetPresignedURLUseCaseInputDTO): Promise<string> {
    const url = await this.storageService.createPresignedUrl(
      payload.bucketName,
      payload.fileName,
    );

    return url;
  }
}
