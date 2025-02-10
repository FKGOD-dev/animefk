import pool from "@/utils/db";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { anime_id, rating } = req.body;
    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({ error: "No autorizado" });
    }

    if (!anime_id || !rating) {
      return res.status(400).json({ error: "Datos incompletos" });
    }

    try {
      await pool.query(
        "INSERT INTO ratings (anime_id, rating) VALUES (?, ?) ON DUPLICATE KEY UPDATE rating = VALUES(rating)",
        [anime_id, rating]
      );

      res.status(200).json({ message: "Valoración guardada correctamente" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error en el servidor" });
    }
  } else if (req.method === "GET") {
    // 🔹 Obtener TODOS los ratings de una vez para optimizar la carga
    try {
        const [result] = await pool.query("SELECT anime_id, CAST(AVG(rating) AS DECIMAL(3,1)) as avgRating FROM ratings GROUP BY anime_id");
      res.status(200).json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error en el servidor" });
    }
  } else {
    res.status(405).json({ error: "Método no permitido" });
  }
}
