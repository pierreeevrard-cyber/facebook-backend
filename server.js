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
      return res.status(400).json({ error: "Le champ 'message' est requis." });
    }

    // Utilise les valeurs du client si fournies, sinon celles par défaut (sécurité)
    const PAGE_ID = page_id || "822734930930653";
    const TOKEN = access_token || "EAAWW1PTyrjgBP3QmUezAmucW6tm1GuLZBZCuDz0eaueSAC6SilkcyizpdyUK3qsDlTQ5CKhZBdyPEoZCEL2Xl6olg6qleJNPNOs5sjIV73TpKkc97M8cK7zS6VRSk1qfXzLqQE9SZB7V3vJOTwQOjLuEL18XZCziKVdH15GwSzLu82ZAv79HCoN9qtPAQ7WcgcBBsJbuYXZA4lbLXnoRTGVYcGCxPu2BSrrn6ZAt4THJe";

    let response;

    if (image_url) {
      response = await axios.post(
        `https://graph.facebook.com/v19.0/${PAGE_ID}/photos`,
        { url: image_url, caption: message, access_token: TOKEN }
      );
    } else {
      response = await axios.post(
        `https://graph.facebook.com/v19.0/${PAGE_ID}/feed`,
        { message, access_token: TOKEN }
      );
    }

    console.log("✅ Publication réussie :", response.data);
    res.status(200).json({ success: true, facebook_response: response.data });
  } catch (error) {
    console.error("❌ Erreur :", error.response?.data || error.message);
    res.status(500).json({ success: false, error: error.response?.data || error.message });
  }
});

// === LANCEMENT DU SERVEUR ===
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 ImmoPoster multi-client prêt sur le port ${PORT}`);
});
