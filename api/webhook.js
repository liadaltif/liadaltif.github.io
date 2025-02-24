export default function handler(req, res) {
  console.log('🔹 Incoming Webhook Request:', req.method); // Log request type

  if (req.method === 'POST') {
    let body = '';

    req.on('data', chunk => {
      console.log('🔹 Chunk received:', chunk.toString()); // Log raw chunk data
      body += chunk.toString();
    });

    req.on('end', () => {
      console.log('🔹 Full Raw Body:', body); // Log raw body before parsing

      try {
        const parsedBody = JSON.parse(body);
        console.log('✅ Parsed JSON Body:', JSON.stringify(parsedBody, null, 2)); // Full parsed JSON log

        if (!parsedBody.entry) {
          console.log('⚠️ No "entry" field found in payload.');
          return res.status(400).send('No entry field.');
        }

        parsedBody.entry.forEach((entry, entryIndex) => {
          console.log(`🔹 Entry #${entryIndex}:`, JSON.stringify(entry, null, 2));

          if (!entry.changes) {
            console.log(`⚠️ Entry #${entryIndex} has no "changes" field.`);
            return;
          }

          console.log(`🔹 Full Changes Array for Entry #${entryIndex}:`, JSON.stringify(entry.changes, null, 2));

          entry.changes.forEach((change, changeIndex) => {
            console.log(`🔹 Change #${changeIndex} in Entry #${entryIndex}:`, JSON.stringify(change, null, 2));

            if (!change.field) {
              console.log(`⚠️ Change #${changeIndex} in Entry #${entryIndex} has no "field".`);
              return;
            }

            console.log(`🔹 Field Type in Change #${changeIndex}:`, change.field);

            if (change.field === 'messages' && change.value) {
              console.log('✅ Message Data Found:', JSON.stringify(change.value, null, 2));
            } else {
              console.log(`⚠️ Change #${changeIndex} does not contain messages.`);
            }
          });
        });

        res.status(200).send('OK');
      } catch (error) {
        console.error('❌ Error Parsing Webhook JSON:', error);
        res.status(400).send('Invalid JSON');
      }
    });
  } else {
    console.log('⚠️ Non-POST request received:', req.method);
    return res.status(405).send('Method Not Allowed');
  }
}
