import {
  LocalstackContainer,
  StartedLocalStackContainer,
} from '@testcontainers/localstack';
import { SQSService } from '../../src/infra/services/message/aws/sqs.service';

jest.setTimeout(30000);

describe('SQS', () => {
  let container: StartedLocalStackContainer;
  let containerEndpoint: string;
  let productQueueURL: string;
  const region = 'us-east-1';
  const accessKeyId = 'test';
  const secretAccessKey = 'test';
  const productQueueName = 'queue-register-products';

  beforeAll(async () => {
    container = await new LocalstackContainer(
      'localstack/localstack:3.0.2',
    ).start();

    containerEndpoint = `http://${container.getHost()}:${container.getMappedPort(
      4566,
    )}`;

    const execResult = await container.exec([
      'awslocal',
      'sqs',
      'create-queue',
      '--queue-name',
      `${productQueueName}`,
    ]);

    productQueueURL = JSON.parse(execResult.output).QueueUrl;
  });

  afterAll(async () => {
    await container.stop();
  });

  it('should send message to queue', async () => {
    const products = {
      name: 'Ryzen 3',
    };

    const sqsService = new SQSService({
      region: region,
      accessKeyId: accessKeyId,
      secretAccessKey: secretAccessKey,
      endpoint: containerEndpoint,
    });

    const response = await sqsService.sendMessageToQueue({
      queueURL: productQueueURL,
      messageContent: products,
    });

    expect(response.$metadata.httpStatusCode).toBe(200);
    expect(response.$metadata.attempts).toBe(1);
    expect(response.MessageId).toBeDefined();
  });
});
