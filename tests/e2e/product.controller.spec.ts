import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { ProductModule } from '../../src/application/modules/product.module';
import {
  LocalstackContainer,
  StartedLocalStackContainer,
} from '@testcontainers/localstack';
import {
  S3Client,
  PutObjectCommand,
  CreateBucketCommand,
} from '@aws-sdk/client-s3';
import {
  SQSClient,
  CreateQueueCommand,
  ReceiveMessageCommand,
} from '@aws-sdk/client-sqs';
import { ProductController } from '../../src/application/controller/product.controller';
import { S3Event } from 'aws-lambda';

jest.setTimeout(30000);

describe('ProductController (e2e)', () => {
  let localstackContainer: StartedLocalStackContainer;

  let s3Client: S3Client;
  let sqsClient: SQSClient;
  let productQueueUrl: string;

  let app: INestApplication;
  let productController: ProductController;

  beforeAll(async () => {
    localstackContainer = await new LocalstackContainer(
      'localstack/localstack:3.0.2',
    ).start();

    const endpoint = `http://${localstackContainer.getHost()}:${localstackContainer.getMappedPort(
      4566,
    )}`;

    process.env.S3_ENDPOINT = endpoint;
    process.env.SQS_ENDPOINT = endpoint;
    process.env.AWS_ACCESS_KEY_ID = 'test';
    process.env.AWS_SECRET_ACCESS_KEY = 'test';
    process.env.AWS_REGION = 'us-east-1';

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [ProductModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    productController = app.get<ProductController>(ProductController);

    // Config S3 Client
    s3Client = new S3Client({
      endpoint: process.env.S3_ENDPOINT,
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
      forcePathStyle: true,
    });

    // Config SQS Client
    sqsClient = new SQSClient({
      endpoint: process.env.SQS_ENDPOINT,
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });

    // Create S3 Bucket
    const createBucketCommand = new CreateBucketCommand({
      Bucket: 'test-bucket',
    });
    await s3Client.send(createBucketCommand);

    // Create SQS Queue
    const createQueueCommand = new CreateQueueCommand({
      QueueName: 'queue-products',
    });
    const queueResult = await sqsClient.send(createQueueCommand);
    productQueueUrl = queueResult.QueueUrl;
  });

  it('/product/send-products-to-register-queue (POST)', async () => {
    // Criando bucket S3 e colocando arquivo
    const bucketName = 'test-bucket';
    const fileName = 'register_products.csv';
    const fileContent = 'Nome\nryzen 3\nryzen 5\nryzen 7\n';

    await s3Client.send(
      new PutObjectCommand({
        Bucket: bucketName,
        Key: fileName,
        Body: fileContent,
      }),
    );

    // Simulando o evento de S3
    const event = {
      Records: [
        {
          s3: {
            bucket: { name: bucketName },
            object: { key: fileName },
          },
        },
      ],
    };

    // Executando a chamada para o endpoint
    await productController.SendProductsToRegisterQueue(event as S3Event);

    // Validando se as mensagens foram enviadas para a fila SQS
    const receiveMessageCommand = new ReceiveMessageCommand({
      QueueUrl: productQueueUrl,
      MaxNumberOfMessages: 10,
    });
    const sqsMessages = await sqsClient.send(receiveMessageCommand);

    expect(sqsMessages.Messages.length).toBeGreaterThan(0);

    const messageBodies = sqsMessages.Messages.map((msg) =>
      JSON.parse(msg.Body),
    );

    expect(messageBodies).toEqual(
      expect.arrayContaining([
        { nome: 'ryzen 3' },
        { nome: 'ryzen 5' },
        { nome: 'ryzen 7' },
      ]),
    );
  });

  afterAll(async () => {
    await app.close();
    await localstackContainer.stop();
  });
});
