import express from "express";
import { createServer } from "http";

const app = express();

// Routes
app.get("/", (req, res) => {
    res.end("Hello Node.js");  // 修改这里
});

app.get("/api/item/:slug", (req, res) => {
    const { slug } = req.params;
    res.end(`Item: ${slug}`);
});

// 404 Handler
app.use((req, res) => {
    res.status(404).end("Not Found");
});

// Start the server
const PORT = process.env.PORT || 3100;
const server = createServer(app);

server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

export default app;