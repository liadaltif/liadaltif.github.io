export default function handler(req, res) {
  if (req.method === 'POST') {
    let body = '';

    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', () => {
      try {
        const parsedBody = JSON.parse(body);
        console.log('Raw Webhook event received:', parsedBody); // Logs the entire payload

        if (parsedBody.entry) {
          parsedBody.entry.forEach(entry => {
            if (entry.changes) {
              entry.changes.forEach(change => {
                console.log('Extracted Change:', change); // Logs the change object
              });
            }
          });
        }

        res.status(200).send('OK');
      } catch (error) {
        console.error('Error parsing webhook:', error);
        res.status(400).send('Invalid JSON');
      }
    });
  } else {
    return res.status(405).send('Method Not Allowed');
  }
}
