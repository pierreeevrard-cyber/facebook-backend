import express from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// pour que ton API comprenne le JSON envoyé par n8n
app.use(express.json());

// Route test pour vérifier que tout marche
app.get("/", (req, res) => {
  res.send("✅ Serveur Facebook Backend en ligne !");
});

// Lancer le serveur
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
