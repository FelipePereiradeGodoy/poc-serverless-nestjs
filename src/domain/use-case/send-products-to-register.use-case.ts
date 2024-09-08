import { parse } from 'fast-csv';
import { SQSService } from '../../infra/services/message/aws/sqs.service';
import { S3Storage } from '../../infra/services/storage/aws/s3.service';

export type TProduct = {
  name: string;
};

export type TPayloadSendProductsToRegisterQueueUseCase = {
  bucketName: string;
  fileName: string;
};

export default class SendProductsToRegisterQueueUseCase {
  constructor(
    private storageService: S3Storage,
    private messageService: SQSService,
  ) {}

  async execute(
    payload: TPayloadSendProductsToRegisterQueueUseCase,
  ): Promise<void> {
    const productCSV = await this.storageService.getDataFromBucket(
      payload.bucketName,
      payload.fileName,
    );

    const productsObj = await this.extractCsvToObject(productCSV);

    for (const product of productsObj) {
      await this.messageService.sendMessageToQueue({
        queueURL: 'queue-products',
        messageContent: product,
      });
    }

    return;
  }

  private async extractCsvToObject(productCsv: string): Promise<TProduct[]> {
    const result = await new Promise((resolve, reject) => {
      const products: TProduct[] = [];

      const stream = parse({ headers: ['nome'], renameHeaders: true })
        .on('data', (product) => products.push(product))
        .on('error', (error) => reject(error.message))
        .on('end', () => resolve(products));

      stream.write(productCsv);
      stream.end();
    });

    if (result instanceof Error) throw result;

    return result as TProduct[];
  }
}
