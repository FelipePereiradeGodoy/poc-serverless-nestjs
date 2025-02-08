import { TEmailTransport } from "src/application/modules/email.module";

export type TPayloadSendEMailForNewProductRegisterUseCase = {
    emailFrom: string;
    emailTo: string;
    productName: string;
};

export default class SendEMailForNewProductRegisterUseCase {
    constructor(
        private readonly nodeMailer: TEmailTransport
    ) {}

    async execute(payload: TPayloadSendEMailForNewProductRegisterUseCase): Promise<void> {
        const emailTitle = '[Pingo Tech] - Novo Produto';
        const emailContent = `
            <p>Email Automatico, favor não responder...</p>
            <h2>Um novo produto foi cadastrado em nossa base: <b>${payload.productName}</b></h2>
        `;

        const emailResponse = await this.nodeMailer.sendMail({
            from: payload.emailFrom,
            to: payload.emailTo,
            subject: emailTitle,
            html: emailContent,
        });

        console.log(emailResponse);

        return;
    }
}