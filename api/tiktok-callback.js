import express from 'express';
const app = express();

app.get('/api/tiktok-callback', (req, res) => {
    const authCode = req.query.code; // Extract TikTok auth code

    if (!authCode) {
        return res.status(400).send("No auth code received from TikTok.");
    }

    // Redirect to Solmate app with auth code
    res.redirect(`solmate://tiktok-callback?code=${authCode}`);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
