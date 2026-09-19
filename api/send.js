const express = require('express');
const admin = require('firebase-admin');
const app = express();
app.use(express.json());

if (!admin.apps.length) {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
}

app.post('/api/send', async (req, res) => {
    const { token, title, body } = req.body;
    
    if (!token || !title || !body) {
        return res.status(400).send('Missing token, title, or body');
    }

    try {
                const message = {
            data: { 
                title: title, 
                body: body 
            },
            android: {
                priority: "high"
            },
            token: token
        };

        const response = await admin.messaging().send(message);
        res.status(200).send({ success: true, response });
    } catch (error) {
        res.status(500).send({ success: false, error: error.message });
    }
});

module.exports = app;
