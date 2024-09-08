import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

export type TS3StorageConstructor = {
  endpoint: string;
  region: string;
  accessKeyId: string;
  secretAccessKey: string;
};

export class S3Storage {
  private clientS3: S3Client;

  constructor(payload: TS3StorageConstructor) {
    this.clientS3 = new S3Client({
      region: payload.region,
      credentials: {
        accessKeyId: payload.accessKeyId,
        secretAccessKey: payload.secretAccessKey,
      },
      endpoint: payload.endpoint,
      forcePathStyle: true,
    });
  }

  async createPresignedUrl(bucketName: string, fileName: string) {
    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: fileName,
    });

    const preSignedURL = await getSignedUrl(this.clientS3, command, {
      expiresIn: 60,
    });

    return preSignedURL;
  }

  async getDataFromBucket(bucketName: string, fileName: string) {
    const command = new GetObjectCommand({
      Bucket: bucketName,
      Key: fileName,
    });

    const response = await this.clientS3.send(command);
    const data = await response.Body.transformToString('utf-8');

    return data;
  }
}
