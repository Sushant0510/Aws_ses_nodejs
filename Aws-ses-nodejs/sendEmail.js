const AWS = require('aws-sdk');
require('dotenv').config();

const SES_CONFIG = {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
    region: process.env.AWS_SES_REGION,
};

const AWS_SES = new AWS.SES(SES_CONFIG);

const sendEmail = async (recipientEmails, name, senderEmail, fromName) => {
    let params = {
        Source: `"${fromName}" <${senderEmail}>`, // Combining name and email in "From" field
        Destination: {
            ToAddresses: recipientEmails,
        },
        ReplyToAddresses: [],
        Message: {
            Body: {
                Html: {
                    Charset: 'UTF-8',
                    Data: '<h1>This is the body of my email</h1>',
                },
                Text: {
                    Charset: 'UTF-8',
                    Data: 'This is the body of my email',
                },
            },
            Subject: {
                Charset: 'UTF-8',
                Data: `Hello, ${name}`,
            },
        },
    };

    try {
        const res = await AWS_SES.sendEmail(params).promise();
        console.log('Email has been sent!', res);
    } catch (error) {
        console.log(error);
    }
};

// Example usage:
const recipientEmails = ["sushantkolhe18@gmail.com"];
const name = "testname";
const senderEmail = 'sushantkolhe18@gmail.com'; // Verified sender email address
const fromName = 'Customer name'; // Display name for the "From" email address

sendEmail(recipientEmails, name, senderEmail, fromName);
