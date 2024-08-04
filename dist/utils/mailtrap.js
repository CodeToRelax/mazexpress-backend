"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = void 0;
const axios_1 = __importDefault(require("axios"));
const sendEmail = async (sendTo, user_name, packageNumber, status) => {
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
        const response = await axios_1.default.post(url, data, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        console.log('Email sent successfully:', response.data);
    }
    catch (error) {
        console.error('Error sending email:', error);
    }
};
exports.sendEmail = sendEmail;
//# sourceMappingURL=mailtrap.js.map