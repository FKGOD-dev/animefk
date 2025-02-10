import pool from "@/utils/db";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
  if (req.method === "POST") {
    return addFavorite(req, res);
  } else if (req.method === "DELETE") {
    return removeFavorite(req, res);
  } else if (req.method === "GET") {
    return getFavorites(req, res);
  } else {
    return res.status(405).json({ error: "Método no permitido" });
  }
}

// 🔹 Agregar un anime a favoritos
async function addFavorite(req, res) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No autorizado" });

  try {
    const decoded = jwt.verify(token, "secreto_super_seguro");
    const { anime_id, title, image_url } = req.body;

    await pool.query(
      "INSERT INTO favorites (user_id, anime_id, title, image_url) VALUES (?, ?, ?, ?)",
      [decoded.id, anime_id, title, image_url]
    );

    res.status(201).json({ message: "Anime agregado a favoritos" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error en el servidor" });
  }
}

// 🔹 Eliminar un anime de favoritos
async function removeFavorite(req, res) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No autorizado" });

  try {
    const decoded = jwt.verify(token, "secreto_super_seguro");
    const { anime_id } = req.body;

    await pool.query("DELETE FROM favorites WHERE user_id = ? AND anime_id = ?", [
      decoded.id,
      anime_id,
    ]);

    res.status(200).json({ message: "Anime eliminado de favoritos" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error en el servidor" });
  }
}

// 🔹 Obtener la lista de favoritos del usuario
async function getFavorites(req, res) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No autorizado" });

  try {
    const decoded = jwt.verify(token, "secreto_super_seguro");

    const [favorites] = await pool.query("SELECT * FROM favorites WHERE user_id = ?", [
      decoded.id,
    ]);

    res.status(200).json(favorites);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error en el servidor" });
  }
}
