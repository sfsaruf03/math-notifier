const admin = require('firebase-admin');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    }),
  });
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { token, title, body } = req.body;

  try {
    const message = {
      notification: { title, body },
      token: token,
    };
    const response = await admin.messaging().send(message);
    res.status(200).json({ success: true, response });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
