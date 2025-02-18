// File: api/auth/instagram/token.js

export default async function handler(req, res) {
    if (req.method !== "POST") {
      res.setHeader("Allow", ["POST"]);
      return res.status(405).json({ error: "Method Not Allowed" });
    }
    
    try {
      const { code } = req.body;
      if (!code) {
        return res.status(400).json({ error: "Missing authorization code" });
      }
      
      // Get environment variables.
      const clientId = process.env.INSTAGRAM_CLIENT_ID;
      const clientSecret = process.env.INSTAGRAM_CLIENT_SECRET;
      const redirectUri = process.env.INSTAGRAM_REDIRECT_URI || "https://liadaltif-github-io-eight.vercel.app/api/auth/instagram";
      
      // Build URL-encoded POST body.
      const params = new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: "authorization_code",
        redirect_uri: redirectUri,
        code: code
      });
      
      // Exchange the authorization code for an access token.
      const tokenResponse = await fetch("https://api.instagram.com/oauth/access_token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: params.toString()
      });
      
      // Get the raw text response.
      const textData = await tokenResponse.text();
      let tokenData;
      try {
        tokenData = JSON.parse(textData);
      } catch (parseError) {
        console.error("Failed to parse token response:", textData);
        return res.status(500).json({ error: "Failed to parse token response", raw: textData });
      }
      
      if (!tokenResponse.ok) {
        console.error("Instagram token exchange error:", tokenData);
        return res.status(tokenResponse.status).json({ error: tokenData });
      }
      
      const accessToken = tokenData.access_token;
      if (!accessToken) {
        console.error("No access token in response:", tokenData);
        return res.status(500).json({ error: "No access token in response", response: tokenData });
      }
      
      // Now fetch the Instagram username using the access token.
      const userResponse = await fetch('https://graph.instagram.com/me?fields=username&access_token=${accessToken}');
      const userData = await userResponse.json();
      
      if (!userResponse.ok) {
        console.error("Instagram user fetch error:", userData);
        return res.status(userResponse.status).json({ error: userData });
      }
      
      const username = userData.username;
      res.status(200).json({ username: username, access_token: accessToken });
      
    } catch (error) {
      console.error("Error during token exchange:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }