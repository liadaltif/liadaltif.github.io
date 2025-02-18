// api/webhook.js
 
export default function handler(req, res) {
    // Only allow GET and POST requests
    if (req.method === 'GET') {
      // Extract query parameters
      const mode = req.query['hub.mode'];
      const token = req.query['hub.verify_token'];
      const challenge = req.query['hub.challenge'];
   
      // Check if mode and token are provided
      if (mode && token) {
        // Check if the mode is subscribe and the token matches our verify token
        if (mode === 'subscribe' && token === process.env.VERIFY_TOKEN) {
          console.log('WEBHOOK_VERIFIED');
          return res.status(200).send(challenge);
        } else {
          return res.status(403).send('Verification token mismatch');
        }
      }
      return res.status(400).send('Missing mode or token');
    } else if (req.method === 'POST') {
      // Log the incoming webhook event for debugging
      console.log('Webhook event received:', req.body);
      // Respond with 200 OK
      return res.status(200).send('OK');
    } else {
      // Method Not Allowed
      return res.status(405).send('Method Not Allowed');
    }
  }