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
            console.log('🔹 Entry ID:', entry.id, 'Time:', entry.time);
            
            if (entry.changes) {
              console.log('🔹 Full Changes Array:', JSON.stringify(entry.changes, null, 2)); // Force log changes array
              
              entry.changes.forEach(change => {
                console.log('🔹 Extracted Change:', JSON.stringify(change, null, 2)); // Logs the change object
                
                if (change.field === 'messages' && change.value) {
                  console.log('✅ Message Data:', JSON.stringify(change.value, null, 2)); // Log actual message data
                }
              });
            } else {
              console.log('⚠️ No changes found in entry.');
            }
          });
        } else {
          console.log('⚠️ No entries found in webhook payload.');
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
