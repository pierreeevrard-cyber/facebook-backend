import express from "express";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

const app = express();
app.use(express.json({ limit: "25mb" }));

// === CONFIGURATION FACEBOOK ===
const PAGE_ID = "822734930930653"; // ID de ta page
const PAGE_ACCESS_TOKEN = "EAAWW1PTyrjgBP3QmUezAmucW6tm1GuLZBZCuDz0eaueSAC6SilkcyizpdyUK3qsDlTQ5CKhZBdyPEoZCEL2Xl6olg6qleJNPNOs5sjIV73TpKkc97M8cK7zS6VRSk1qfXzLqQE9SZB7V3vJOTwQOjLuEL18XZCziKVdH15GwSzLu82ZAv79HCoN9qtPAQ7WcgcBBsJbuYXZA4lbLXnoRTGVYcGCxPu2BSrrn6ZAt4THJe";

// === ROUTE TEST ===
app.get("/", (req, res) => {
  res.send("✅ ImmoPoster backend est en ligne et prêt à publier !");
});

// === ROUTE POUR LES PUBLICATIONS ===
app.post("/publish", async (req, res) => {
  try {
    const { message, image_url } = req.body;

    if (!message) {
      return res.status(400).json({
        error: "❌ Le champ 'message' est requis.",
      });
    }

    let response;

    if (image_url) {
      // 🖼️ Publication avec une image
      console.log("🖼️ Publication avec image :", image_url);
      response = await axios.post(
        `https://graph.facebook.com/v19.0/${PAGE_ID}/photos`,
        {
          url: image_url,
          caption: message,
          access_token: PAGE_ACCESS_TOKEN,
        }
      );
    } else {
      // 💬 Publication texte seule
      console.log("💬 Publication texte seule :", message);
      response = await axios.post(
        `https://graph.facebook.com/v19.0/${PAGE_ID}/feed`,
        {
          message,
          access_token: PAGE_ACCESS_TOKEN,
        }
      );
    }

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
  console.log(`🚀 Serveur ImmoPoster en ligne sur le port ${PORT}`);
});
