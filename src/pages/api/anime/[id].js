import pool from "@/utils/db";

export default async function handler(req, res) {
  const { id } = req.query;

  try {
    const [rows] = await pool.query("SELECT * FROM animes WHERE id = ?", [id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: "Anime no encontrado" });
    }

    res.status(200).json(rows[0]);
  } catch (error) {
    console.error("Error al obtener el anime:", error);
    res.status(500).json({ error: "Error al obtener el anime" });
  }
}
