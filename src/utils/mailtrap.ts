import axios from 'axios';

export const sendEmail = async (sendTo: string, user_name: string, packageNumber: string, status: string) => {
  const url = 'https://sandbox.api.mailtrap.io/api/send/3059966';
  const token = process.env.MAILTRAP_TOKEN;
  const data = {
    from: {
      email: 'status-update@mazexpress.ly',
      name: 'Mazexpress Package Status Update',
    },
    to: [
      {
        email: 'mohammedzeo.tech@gmail.com',
      },
    ],
    subject: 'You are awesome!',
    text: `Dear ${user_name},

We are pleased to inform you that your package has been updated successfully.

Here are the details:
- Package ID: ${packageNumber}
- Status: ${status}
- Update Date: ${new Date().toLocaleDateString()}
- Description: Your package has been processed and updated with the latest information.

Thank you for choosing our service.

Best regards,
Mazexpress Team`,
    category: 'PackageUpdate',
  };

  try {
    const response = await axios.post(url, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    console.log('Email sent successfully:', response.data);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};
