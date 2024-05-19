const AWS = require('aws-sdk');
require('dotenv').config();


// Log environment variables to verify they are loaded correctly
// console.log('AWS_ACCESS_KEY:', process.env.AWS_ACCESS_KEY);
// console.log('AWS_SECRET_KEY:', process.env.AWS_SECRET_KEY);
// console.log('AWS_SES_REGION:', process.env.AWS_SES_REGION);
// console.log('AWS_SES_SENDER:', process.env.AWS_SES_SENDER);

const SES_CONFIG={
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey:process.env.AWS_SECRET_KEY,
    region: process.env.AWS_SES_REGION,
};

const AWS_SES= new AWS.SES(SES_CONFIG);

const sendEmail= async(recepientEmail, name)=>{
    let params={
        Source: process.env.AWS_SES_SENDER,
        Destination:{
              ToAddresses:
                recepientEmail
              ,
        },
        ReplyToAddresses:[],
        Message:{
            Body:{
                Html:{
                    Charset:'UTF-8',
                    Data:'<h1>This is the body of my email</h1>'
                },
                Text:{
                    Charset:"UTF-8",
                    Data:'This is the body of my email'
                }
            },

            Subject:{
                Charset:'UTF-8',
                Data:`Hello, ${name}`,
            }
        },
    };

    try{
        const res = await AWS_SES.sendEmail(params).promise();
        console.log('Email has been sent!',res);
        
    }
    catch(error){
        console.log(error);

    }
}



sendEmail(["sushantkolhe18@gmail.com", "swapnilkolhe770@gmail.com"],"testname");

