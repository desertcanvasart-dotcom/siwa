import { MailService } from '@sendgrid/mail';
import type { HotelRequest } from '@shared/schema';

if (!process.env.SENDGRID_API_KEY) {
  console.warn("SENDGRID_API_KEY environment variable is not set. Email sending will be disabled in development.");
}

const mailService = new MailService();
if (process.env.SENDGRID_API_KEY) {
  mailService.setApiKey(process.env.SENDGRID_API_KEY);
}

interface EmailParams {
  to: string;
  from: string;
  replyTo?: string;
  subject: string;
  text?: string;
  html?: string;
}

export async function sendEmail(params: EmailParams): Promise<boolean> {
  try {
    if (!process.env.SENDGRID_API_KEY) {
      console.log('Development mode: Email would be sent with content:', params);
      return true; // Return success in development mode
    }

    const mailData: any = {
      to: params.to,
      from: params.from,
      subject: params.subject,
    };

    if (params.replyTo) {
      mailData.replyTo = params.replyTo;
    }

    if (params.text) {
      mailData.text = params.text;
    }
    if (params.html) {
      mailData.html = params.html;
    }

    await mailService.send(mailData);
    
    console.log('Email sent successfully to:', params.to);
    return true;
  } catch (error) {
    console.error('SendGrid email error:', error);
    return false;
  }
}

export function generateHotelRequestEmail(request: HotelRequest): EmailParams {
  const { name, email, phone = '', checkIn, checkOut, guests, message, hotelName, hotelEmail } = request;
  
  const subject = `New Hotel Request - ${hotelName}`;
  
  const text = `
New Hotel Request Received

Hotel: ${hotelName}
Hotel Contact Email: ${hotelEmail || 'Not provided'}
Guest Name: ${name}
Email: ${email}
Phone: ${phone || 'Not provided'}

Check-in: ${checkIn || 'Not specified'}
Check-out: ${checkOut || 'Not specified'}
Number of Guests: ${guests}

Special Requests/Message:
${message || 'No special requests'}

Please contact the guest at ${email}${phone ? ` or ${phone}` : ''} to follow up on this request.
`;

  const html = `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #1a365d; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background-color: #f8f9fa; }
        .field { margin-bottom: 15px; }
        .label { font-weight: bold; color: #1a365d; }
        .value { margin-left: 10px; }
        .message-box { background-color: white; padding: 15px; border-left: 4px solid #1a365d; margin-top: 20px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>New Hotel Request</h1>
        </div>
        <div class="content">
            <div class="field">
                <span class="label">Hotel:</span>
                <span class="value">${hotelName}</span>
            </div>
            <div class="field">
                <span class="label">Hotel Contact Email:</span>
                <span class="value">${hotelEmail || 'Not provided'}</span>
            </div>
            <div class="field">
                <span class="label">Guest Name:</span>
                <span class="value">${name}</span>
            </div>
            <div class="field">
                <span class="label">Email:</span>
                <span class="value">${email}</span>
            </div>
            <div class="field">
                <span class="label">Phone:</span>
                <span class="value">${phone || 'Not provided'}</span>
            </div>
            <div class="field">
                <span class="label">Check-in:</span>
                <span class="value">${checkIn || 'Not specified'}</span>
            </div>
            <div class="field">
                <span class="label">Check-out:</span>
                <span class="value">${checkOut || 'Not specified'}</span>
            </div>
            <div class="field">
                <span class="label">Number of Guests:</span>
                <span class="value">${guests}</span>
            </div>
            ${message ? `
            <div class="message-box">
                <h3>Special Requests/Message:</h3>
                <p>${message.replace(/\n/g, '<br>')}</p>
            </div>
            ` : ''}
            <p style="margin-top: 30px; color: #666;">
                Please contact the guest at <strong>${email}</strong>${phone ? ` or <strong>${phone}</strong>` : ''} to follow up on this request.
            </p>
        </div>
    </div>
</body>
</html>
`;

  return {
    to: 'hello@solei.com',
    from: 'hello@solei.com', // Verified sender
    replyTo: email, // Guest's email for direct replies
    subject,
    text,
    html,
  };
}