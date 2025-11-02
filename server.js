import express from "express";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

const app = express();
app.use(express.json());

// === CONFIGURATION FACEBOOK ===
const PAGE_ID = "822734930930653"; // Ton Page ID
const PAGE_ACCESS_TOKEN = "EAAWW1PTyrjgBP6SJog5lAQhLJqNzZCdl3uLQqWyixZBEZCDtPDrqizhDNOSdDF70bl2bAbV1LDjm8pgt2vFF2QOjiTjOIkLxaRtffAopZBxlpFHaN1EFZB6DxnpP21RAbYsnGA1eljpxuCDsTQpZB10aXoNkJhxeWkqwA78S9pfl3aZCCqJwHp0XrBluQwZAyEHpQWV5ZBz1dqfZCxOjkoC32zr6fj3KUwzQ69lOFHG0Tg";

// === ROUTE TEST ===
app.get("/", (req, res) => {
  res.send("✅ Serveur ImmoPoster prêt à publier sur Facebook !");
});

// === ROUTE POUR RECEVOIR LES DONNÉES DE N8N ===
app.post("/publish", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Le champ 'message' est requis." });
    }

    // Requête vers l'API Graph Facebook
    const response = await axios.post(
      `https://graph.facebook.com/v24.0/${PAGE_ID}/feed`,
      {
        message,
        access_token: PAGE_ACCESS_TOKEN,
      }
    );

    console.log("✅ Publication réussie :", response.data);

    res.status(200).json({
      success: true,
      facebook_response: response.data,
    });
  } catch (error) {
    console.error("❌ Erreur lors de la publication :", error.response?.data || error.message);
    res.status(500).json({
      success: false,
      error: error.response?.data || error.message,
    });
  }
});

// === LANCER LE SERVEUR ===
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur le port ${PORT}`);
});
