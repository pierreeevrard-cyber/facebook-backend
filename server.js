import express from "express";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

const app = express();
app.use(express.json());

// === CONFIGURATION FACEBOOK ===
const PAGE_ID = "822734930930653"; // Ton Page ID
const PAGE_ACCESS_TOKEN = "EAAWW1PTyrjgBP9VEDvwm34jWN7UXQlPUWBgkmcE20qcqkl8k1j1B7XuAZBoWsZACLZAzTerb79pATOC8u7D1F7mPEZAGW9GoElNkNNDNP5VoPZBGNa19g6ZAglME3vjgwxm9Q38XqMZAecGTTZApVmZA2Utk7fBmO9mCzSIA27ZCr6tBHYo62BgGEcZCFDLeklKtKlYJdtvoBI5Ar5XxgdEvfoJOtF6Q9PMKQ2R5SRUnQCFiewkHZA0ZAYY7BFwU2c0ZBfMwdrXmbwlSEaZC7uV4N8ZD";

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
        access_token: EAAWW1PTyrjgBPZCM2HLHnYlTUoxE17908h1GZBpZBCkjxRZCItfWLA8vp2Y23waAQCntecV20g25hCcqLDIxNSgIZBRrlZA8p4otZB9mvIsatd6AqWb44o39LNp0LEK8ldZBPQB2tu5OSq33kAwkA2GkhTxlCZAxbZAzXvzXr5biBqM0XIoxRHD1ZBOYScR0ZCnHP5BJfq2GyYZCnDNiuZAyG9Dwa2MZBRxK3cRtLpqSZAorlmO3iZBNB,
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
