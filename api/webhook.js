export default function handler(req, res) {
  if (req.method === 'POST') {
    let body = '';

    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', () => {
      try {
        const parsedBody = JSON.parse(body);
        console.log('🔹 Raw Webhook event received:', JSON.stringify(parsedBody, null, 2)); // Full JSON Log

        if (parsedBody.entry) {
          parsedBody.entry.forEach(entry => {
            console.log('🔹 Entry:', JSON.stringify(entry, null, 2));

            if (entry.changes) {
              entry.changes.forEach(change => {
                console.log('🔹 Extracted Change:', JSON.stringify(change, null, 2)); // Logs the change object
                
                // If the change contains message data, log it separately
                if (change.field === 'messages' && change.value) {
                  console.log('✅ Message Data:', JSON.stringify(change.value, null, 2));
                }
              });
            }
          });
        }

        res.status(200).send('OK');
      } catch (error) {
        console.error('❌ Error parsing webhook:', error);
        res.status(400).send('Invalid JSON');
      }
    });
  } else {
    return res.status(405).send('Method Not Allowed');
  }
}
