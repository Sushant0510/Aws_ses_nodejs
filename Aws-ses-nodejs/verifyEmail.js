const AWS = require('aws-sdk');
require('dotenv').config();

const SES_CONFIG = {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
    region: process.env.AWS_SES_REGION,
};

const AWS_SES = new AWS.SES(SES_CONFIG);

const verifyEmail = async (emailAddress) => {
    try {
        const res = await AWS_SES.verifyEmailAddress({ EmailAddress: emailAddress }).promise();
        console.log(`Verification request sent for ${emailAddress}`);
        console.log(res);
    } catch (error) {
        console.log(`Error verifying ${emailAddress}:`, error);
    }
};

// Example usage:
const emailAddressesToVerify = ["sushantkolhe18@gmail.com", "sushant.kolhe@logoinfosoft.in"];

emailAddressesToVerify.forEach(verifyEmail);
