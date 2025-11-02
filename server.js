import express from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Pour que ton API comprenne le JSON envoyé par n8n
app.use(express.json());

// ✅ Route test pour vérifier que le serveur tourne
app.get("/", (req, res) => {
  res.send("✅ Serveur Facebook Backend en ligne !");
});

// 🔐 Middleware de sécurité : vérifie la clé API dans les headers
app.use((req, res, next) => {
  const apiKey = req.headers["x-api-key"];
  if (!apiKey || apiKey !== process.env.API_KEY) {
    return res.status(403).json({ error: "⛔ Accès refusé : clé API invalide" });
  }
  next();
});

// 📦 Route pour recevoir les requêtes Facebook
app.post("/api/facebook", (req, res) => {
  const data = req.body;

  console.log("📩 Données reçues depuis n8n :", data);

  // Ici plus tard on ajoutera la logique de publication vers Facebook
  res.json({
    message: "✅ Données reçues et vérifiées avec succès !",
    data: data,
  });
});

// 🚀 Lancer le serveur
app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur le port ${PORT}`);
});
