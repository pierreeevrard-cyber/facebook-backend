import express from "express";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

const app = express();
app.use(express.json({ limit: "25mb" }));

// === ROUTE TEST ===
app.get("/", (req, res) => {
  res.send("✅ ImmoPoster backend multi-client en ligne !");
});

// === 🔐 MIDDLEWARE DE SÉCURITÉ ===
app.use((req, res, next) => {
  const apiKey = req.headers["x-api-key"];
  if (!apiKey || apiKey !== process.env.API_KEY) {
    return res.status(401).json({ error: "❌ Accès refusé : clé API invalide" });
  }
  next();
});

// === ROUTE /publish ===
app.post("/publish", async (req, res) => {
  try {
    const { message, image_url, page_id, access_token } = req.body;

    if (!message) {
      return res.status(400).json({ error: "❌ Le champ 'message' est requis." });
    }

    // ✅ Si pas fourni dans le body, on prend les valeurs par défaut de Render (.env)
    const PAGE_ID = page_id || process.env.PAGE_ID;
    const TOKEN = access_token || process.env.PAGE_ACCESS_TOKEN;

    let postData = {};
    let endpoint = "";

    // 🧩 Si une image est fournie
    if (image_url) {
      // Si l’image vient de Google Drive → on la convertit en lien direct
      let finalUrl = image_url;
      if (image_url.includes("drive.google.com")) {
        const match = image_url.match(/[-\w]{25,}/);
        if (match) {
          const fileId = match[0];
          finalUrl = `https://drive.google.com/uc?export=view&id=${fileId}`;
        }
      }

      endpoint = `https://graph.facebook.com/v19.0/${PAGE_ID}/photos`;
      postData = {
        url: finalUrl,
        caption: message,
        access_token: TOKEN,
      };
    } else {
      // 💬 Sinon, publication texte simple
      endpoint = `https://graph.facebook.com/v19.0/${PAGE_ID}/feed`;
      postData = {
        message,
        access_token: TOKEN,
      };
    }

    const response = await axios.post(endpoint, postData);

    console.log("✅ Publication réussie :", response.data);
    res.status(200).json({
      success: true,
      facebook_response: response.data,
    });
  } catch (error) {
    console.error("❌ Erreur :", error.response?.data || error.message);
    res.status(500).json({
      success: false,
      error: error.response?.data || error.message,
    });
  }
});

// === LANCEMENT DU SERVEUR ===
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 ImmoPoster multi-client prêt sur le port ${PORT}`);
});
