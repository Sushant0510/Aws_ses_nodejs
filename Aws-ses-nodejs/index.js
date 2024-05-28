const express = require('express');
const fileUpload = require('express-fileupload');
const { verifyAndSendEmail } = require('./verifyAndSendEmail');

const app = express();
const port = 3000;

app.use(express.json());
app.use(fileUpload());

app.post('/send-email', async (req, res) => {
    try {
        const { recipientEmail, senderEmail, senderName, attachmentFilename } = req.body;

        console.log(req);
        
        if (!req.files || !req.files.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const attachmentData = req.files.file.data;

        await verifyAndSendEmail(recipientEmail, senderEmail, senderName, attachmentData, attachmentFilename);
        
        res.status(200).json({ message: 'Email sent successfully' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ error: 'Failed to send email' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
