export type TPayloadSendEMailForNewProductRegisterUseCase = {
    productName: string;
};

export default class SendEMailForNewProductRegisterUseCase {
    constructor() {}

    async execute(payload: TPayloadSendEMailForNewProductRegisterUseCase): Promise<void> {
        const emailTitle = '';
        const emailContent = `
            <p>Email Automatico, favor não responder...</p>
            <h2>Um novo produto foi cadastrado em nossa base: <b>${payload.productName}</b></h2>
        `;

        await this.sendEmailUseCase.execute({
            to: 'teste@email.com',
            from: 'envia_teste@email.com',
            subject: emailTitle,
            html: emailContent,
        });
    }
}