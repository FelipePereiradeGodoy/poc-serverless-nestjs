import {
  LocalstackContainer,
  StartedLocalStackContainer,
} from '@testcontainers/localstack';
import {
  CreateBucketCommand,
  PutObjectCommand,
  S3Client,
  S3ClientConfig,
} from '@aws-sdk/client-s3';
import { S3Storage } from '../../src/infra/services/storage/aws/s3.service';

jest.setTimeout(30000);

describe('S3', () => {
  let container: StartedLocalStackContainer;
  let s3Client: S3Client;
  let s3Storage: S3Storage;
  const region = 'us-east-1';
  const accessKeyId = 'test';
  const secretAccessKey = 'test';

  beforeAll(async () => {
    container = await new LocalstackContainer().start();
    const endpoint = `http://${container.getHost()}:${container.getMappedPort(
      4566,
    )}`;

    const s3ClientPayload: S3ClientConfig = {
      region: region,
      credentials: {
        accessKeyId: accessKeyId,
        secretAccessKey: secretAccessKey,
      },
      forcePathStyle: true,
      endpoint: endpoint,
    };

    s3Client = new S3Client(s3ClientPayload);

    s3Storage = new S3Storage({
      region: region,
      accessKeyId: accessKeyId,
      secretAccessKey: secretAccessKey,
      endpoint: endpoint,
    });
  });

  afterAll(async () => {
    await container.stop();
  });

  it('should create a presigned URL', async () => {
    const preSignedURL = await s3Storage.createPresignedUrl(
      'test-bucket',
      'register_products.csv',
    );

    expect(preSignedURL).toBeDefined();
  });

  it('should get data from bucket', async () => {
    //Start mock csv
    const createBucketCommand = new CreateBucketCommand({
      Bucket: 'test-bucket',
    });
    await s3Client.send(createBucketCommand);

    const csvContent = 'Nome\nryzen 3\nryzen 5\nryzen 7';

    const putObjectCommand = new PutObjectCommand({
      Bucket: 'test-bucket',
      Key: 'register_products.csv',
      Body: csvContent,
    });
    await s3Client.send(putObjectCommand);
    //End mock csv

    const data = await s3Storage.getDataFromBucket(
      'test-bucket',
      'register_products.csv',
    );

    expect(data).toBe('Nome\nryzen 3\nryzen 5\nryzen 7');
  });
});
