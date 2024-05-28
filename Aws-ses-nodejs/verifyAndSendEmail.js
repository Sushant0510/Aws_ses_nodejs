const AWS = require('aws-sdk');
const fs = require('fs');
require('dotenv').config();

const SES_CONFIG = {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
    region: process.env.AWS_SES_REGION,
};

const AWS_SES = new AWS.SES(SES_CONFIG);

const verifyAndSendEmail = async (recipientEmail, senderEmail, senderName, attachmentData, attachmentFilename) => {
    try {
        // Check if sender email is already verified
        const senderVerificationResult = await AWS_SES.getIdentityVerificationAttributes({
            Identities: [senderEmail]
        }).promise();

        // Check if sender email exists in the verification result and if it is verified
        if (senderVerificationResult && senderVerificationResult.VerificationAttributes[senderEmail]) {
            const verificationStatus = senderVerificationResult.VerificationAttributes[senderEmail].VerificationStatus;
            if (verificationStatus !== 'Success') {
                // If sender email is not verified, initiate verification
                await AWS_SES.verifyEmailAddress({ EmailAddress: senderEmail }).promise();
                console.log(`Verification request sent for ${senderEmail}`);
            }
        } else {
            // If sender email is not found in verification result, initiate verification
            await AWS_SES.verifyEmailAddress({ EmailAddress: senderEmail }).promise();
            console.log(`Verification request sent for ${senderEmail}`);
        }

        // Construct email parameters
        const boundary = `boundary_${Math.random().toString().substr(2)}`;
           
       
        const attachmentDataEncoded = attachmentData.toString('base64');

        const message = `From: "${senderName}" <${senderEmail}>
To: ${recipientEmail}
Subject: Test Email
MIME-Version: 1.0
Content-Type: multipart/mixed; boundary="${boundary}"

--${boundary}
Content-Type: text/plain; charset=utf-8

This is the body of the email.

--${boundary}
Content-Type: application/pdf
Content-Disposition: attachment; filename="${attachmentFilename}"
Content-Transfer-Encoding: base64

${attachmentDataEncoded} // Using encoded attachmentData

--${boundary}--`;

        const params = {
            RawMessage: {
                Data: Buffer.from(message),
            }
        };

        // Send the email
        const sendEmailResult = await AWS_SES.sendRawEmail(params).promise();
        console.log('Email sent:', sendEmailResult);
    } catch (error) {
        console.log('Error:', error);
    }
};


// const encodeAttachmentToBase64 = (filePath) => {
//     return new Promise((resolve, reject) => {
//         fs.readFile(filePath, (err, data) => {
//             if (err) {
//                 reject(err);
//             } else {
//                 const base64Data = Buffer.from(data).toString('base64');
//                 resolve(base64Data);
//             }
//         });
//     });
// };

module.exports = {
    verifyAndSendEmail
};
