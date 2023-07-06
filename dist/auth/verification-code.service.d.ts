export declare class VerificationCodeService {
    private transporter;
    constructor();
    generateVerificationCode(toEmail: string): Promise<string>;
    sendVerificationEmail(to: string, subject: string, body: string): Promise<void>;
}
