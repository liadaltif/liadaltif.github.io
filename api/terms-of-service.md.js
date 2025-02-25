export default function handler(req, res) {
    res.setHeader('Content-Type', 'text/plain');
    res.status(200).send("tiktok-developers-site-verification=bIfQfkNtzDmpH2wT3yaxsYpWHGqxAL94"); // Ensure this matches the content of 12345.txt
}
