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
      
      // Read environment variables (ensure these are set in your Vercel project)
      const clientId = process.env.INSTAGRAM_CLIENT_ID; // "1180245893804789"
      const clientSecret = process.env.INSTAGRAM_CLIENT_SECRET; // Your Instagram client secret
      // The redirect URI must match what you used in your initial OAuth flow.
      const redirectUri = process.env.INSTAGRAM_REDIRECT_URI || "https://liadaltif-github-io-eight.vercel.app/api/auth/instagram";
      
      // Exchange the authorization code for an access token.
      const tokenResponse = await fetch("https://api.instagram.com/oauth/access_token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          client_id: clientId,
          client_secret: clientSecret,
          grant_type: "authorization_code",
          redirect_uri: redirectUri,
          code: code
        })
      });
      
      const tokenData = await tokenResponse.json();
      
      if (!tokenResponse.ok) {
        // If Instagram returns an error, forward it.
        return res.status(tokenResponse.status).json({ error: tokenData });
      }
      
      // tokenData should include "access_token" and "user_id"
      const accessToken = tokenData.access_token;
      
      // Now, fetch the username from Instagram's Graph API.
      const userResponse = await fetch('https://graph.instagram.com/me?fields=username&access_token=${accessToken}');
      const userData = await userResponse.json();
      
      if (!userResponse.ok) {
        return res.status(userResponse.status).json({ error: userData });
      }
      
      const username = userData.username;
      
      // Return the username and access token to the caller.
      res.status(200).json({
        username: username,
        access_token: accessToken
      });
      
    } catch (error) {
      console.error("Error during token exchange:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }