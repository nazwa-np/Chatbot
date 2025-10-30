import express from "express";
import fetch from "node-fetch";
import bodyParser from "body-parser";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

const PORT = 5000;
const API_KEY = "AIzaSyD_3cOMBbQAhTM9nq_UxAe_jq-aEiEIkLo";
const MODEL = "models/gemini-2.5-flash";

app.post("/chat", async (req, res) => {
  const { message } = req.body;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/${MODEL}:generateContent?key=${API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: message }] }],
        }),
      }
    );

    const data = await response.json();
    const aiText =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Maaf, tidak ada respon dari AI.";

    res.json({ reply: aiText });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ reply: "Terjadi kesalahan pada server." });
  }
});

app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});
