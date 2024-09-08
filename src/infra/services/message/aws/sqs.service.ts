import {
  SendMessageCommand,
  SendMessageCommandInput,
  SQSClient,
} from '@aws-sdk/client-sqs';

export type TSQSServiceConstructor = {
  region: string;
  endpoint: string;
  accessKeyId: string;
  secretAccessKey: string;
};

export type TSendMessageToQueueInputDTO = {
  queueURL: string;
  messageContent: object;
  delaySecondes?: number;
};

export class SQSService {
  private sqsClient: SQSClient;

  constructor(payload: TSQSServiceConstructor) {
    this.sqsClient = new SQSClient({
      region: payload.region,
      endpoint: payload.endpoint,
      credentials: {
        accessKeyId: payload.accessKeyId,
        secretAccessKey: payload.secretAccessKey,
      },
    });
  }

  async sendMessageToQueue(payload: TSendMessageToQueueInputDTO) {
    const input: SendMessageCommandInput = {
      QueueUrl: payload.queueURL,
      MessageBody: JSON.stringify(payload.messageContent),
      DelaySeconds: payload.delaySecondes || 0,
    };

    const command = new SendMessageCommand(input);
    const mensagem = await this.sqsClient.send(command);

    return mensagem;
  }
}
