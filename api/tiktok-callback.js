// pages/api/tiktok-callback.js

export default function handler(req, res) {
  // Extract query parameters (for example, TikTok might send ?authCode=...)
  const { authCode, ...rest } = req.query;

  // Log the received parameters for debugging purposes
  console.log("TikTok callback received:", req.query);

  // Respond with a JSON payload (or you could render a simple HTML page)
  res.status(200).json({
    message: "TikTok callback received successfully",
    authCode: authCode || null,
    otherParams: rest,
  });
}
