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

// Route pour recevoir les requêtes de n8n
app.post("/api/test", (req, res) => {
  console.log("Requête reçue :", req.body);
  res.json({
    message: "✅ Données reçues avec succès !",
    data: req.body
  });
});

// Lancer le serveur
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
