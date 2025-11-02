import express from "express";
import dotenv from "dotenv";
import axios from "axios";
import FormData from "form-data";
import fs from "fs";

dotenv.config();

const app = express();
app.use(express.json({ limit: "25mb" })); // Pour accepter les images encodées en base64

// === CONFIG FACEBOOK ===
const PAGE_ID = "822734930930653";
const PAGE_ACCESS_TOKEN = "EAAWW1PTyrjgBP6SJog5lAQhLJqNzZCdl3uLQqWyixZBEZCDtPDrqizhDNOSdDF70bl2bAbV1LDjm8pgt2vFF2QOjiTjOIkLxaRtffAopZBxlpFHaN1EFZB6DxnpP21RAbYsnGA1eljpxuCDsTQpZB10aXoNkJhxeWkqwA78S9pfl3aZCCqJwHp0XrBluQwZAyEHpQWV5ZBz1dqfZCxOjkoC32zr6fj3KUwzQ69lOFHG0Tg";

// === ROUTE DE TEST ===
app.get("/", (req, res) => {
  res.send("✅ ImmoPoster backend est en ligne et prêt à publier !");
});

// === ROUTE POUR LES PUBLICATIONS ===
app.post("/publish", async (req, res) => {
  try {
    const { message, image_url, base64_image } = req.body;

    if (!message && !image_url && !base64_image) {
      return res.status(400).json({
        error: "❌ Le champ 'message', 'image_url' ou 'base64_image' est requis.",
      });
    }

    let response;

    // === Cas 1 : Publication avec une image distante ===
    if (image_url) {
      response = await axios.post(
        `https://graph.facebook.com/v24.0/${PAGE_ID}/photos`,
        {
          url: image_url,
          caption: message || "",
          access_token: PAGE_ACCESS_TOKEN,
        }
      );
    }

    // === Cas 2 : Publication avec une image en base64 ===
    else if (base64_image) {
      const form = new FormData();
      const buffer = Buffer.from(base64_image, "base64");
      form.append("source", buffer, { filename: "photo.jpg" });
      form.append("caption", message || "");
      form.append("access_token", PAGE_ACCESS_TOKEN);

      response = await axios.post(
        `https://graph.facebook.com/v24.0/${PAGE_ID}/photos`,
        form,
        { headers: form.getHeaders() }
      );
    }

    // === Cas 3 : Publication texte uniquement ===
    else {
      response = await axios.post(
        `https://graph.facebook.com/v24.0/${PAGE_ID}/feed`,
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
    console.error("❌ Erreur Facebook API :", error.response?.data || error.message);
    res.status(500).json({
      success: false,
      error: error.response?.data || error.message,
    });
  }
});

// === LANCEMENT SERVEUR ===
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Serveur ImmoPoster en ligne sur le port ${PORT}`);
});
