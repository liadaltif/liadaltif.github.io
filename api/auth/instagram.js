// File: api/auth/instagram.js

export default function handler(req, res) {
    const { code } = req.query;
  
    if (code) {
      // Return an HTML page that automatically redirects to your app using the custom URL scheme.
      res.setHeader("Content-Type", "text/html");
      res.status(200).send(`
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>Authentication Complete</title>
        </head>
        <body>
          <script type="text/javascript">
            // Automatically redirect back to the app with the authorization code
            window.location.href = "solmate://auth?code=${code}";
          </script>
          <p>If you are not redirected automatically, <a href="solmate://auth?code=${code}">click here</a>.</p>
        </body>
        </html>
      `);
    } else {
      res.status(400).json({ error: "Missing authorization code in query parameters" });
    }
  }