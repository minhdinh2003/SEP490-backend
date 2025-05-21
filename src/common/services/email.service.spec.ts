// email.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { EmailService } from './email.service';
import * as commonUtils from 'src/utils/common.utils';

// Thiết lập các biến môi trường để khởi tạo EmailService
process.env.MAILJET_API_KEY = 'fake-api-key';
process.env.MAILJET_SECRET_KEY = 'fake-secret-key';
process.env.MAILJET_FROM_ADDRESS = 'from@example.com';
process.env.MAILJET_FROM_NAME = 'Example Sender';

// Các hàm tiện ích được mock
const fakeTemplate = 'Hello, {{OTP}}!';
const fakeContent = 'Hello, 123456!';

// Mock các hàm tiện ích từ common.utils
jest.spyOn(commonUtils, 'getTemplateContent').mockImplementation(() => fakeTemplate);
jest.spyOn(commonUtils, 'replaceContent').mockImplementation(() => fakeContent);

// Mock node-mailjet
const postRequestMock = jest.fn();
const postMock = jest.fn(() => ({
  request: postRequestMock,
}));
jest.mock('node-mailjet', () => {
  return jest.fn(() => ({
    post: postMock,
  }));
});

describe('EmailService', () => {
  let emailService: EmailService;

  beforeEach(async () => {

    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});

    const module: TestingModule = await Test.createTestingModule({
      providers: [EmailService],
    }).compile();

    emailService = module.get<EmailService>(EmailService);
  });

  it('should send email successfully', async () => {
    // Giả lập response thành công từ Mailjet
    postRequestMock.mockResolvedValue({
      body: {
        Messages: [{ Status: 'success' }],
      },
    });

    const result = await emailService.sendEmail(
      'user@example.com',
      'Test Subject',
      'TestTemplate.html',
      { OTP: '123456' }
    );

    expect(commonUtils.getTemplateContent).toHaveBeenCalledWith('TestTemplate.html');
    expect(commonUtils.replaceContent).toHaveBeenCalledWith(fakeTemplate, { OTP: '123456' });
    expect(postMock).toHaveBeenCalledWith('send', { version: 'v3.1' });
    expect(result).toBe(true);
  });

  it('should return false if email sending fails (non-success status)', async () => {
    // Giả lập response không thành công (status khác "success")
    postRequestMock.mockResolvedValue({
      body: {
        Messages: [{ Status: 'error', Errors: [{ ErrorMessage: 'Something went wrong' }] }],
      },
    });

    const result = await emailService.sendEmail(
      'user@example.com',
      'Test Subject',
      'TestTemplate.html',
      { OTP: '123456' }
    );

    expect(result).toBe(false);
  });

  it('should return false if mailjet post request throws an error', async () => {
    // Giả lập ném lỗi khi gửi email
    postRequestMock.mockRejectedValue(new Error('Network error'));

    const result = await emailService.sendEmail(
      'user@example.com',
      'Test Subject',
      'TestTemplate.html',
      { OTP: '123456' }
    );
    expect(result).toBe(false);
  });
});
