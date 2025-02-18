// File: api/auth/instagram.js
 
export default function handler(req, res) {
    // Extract the authorization code from the query parameters.
    const { code } = req.query;
   
    if (code) {
      // Here you have the authorization code.
      // In a real-world scenario, you would now send this code to your backend
      // to exchange it for an access token securely.
      res.status(200).json({
        message: "Authorization code received",
        code: code,
      });
    } else {
      // If there's no code parameter, return an error.
      res.status(400).json({ error: "Missing authorization code in query parameters" });
    }
  }