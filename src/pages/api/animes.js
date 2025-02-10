import pool from "@/utils/db";

export default async function handler(req, res) {
  try {
    const [rows] = await pool.query("SELECT * FROM animes");
    res.status(200).json(rows);
  } catch (error) {
    console.error("Error al obtener animes:", error);
    res.status(500).json({ error: "Error al obtener animes" });
  }
}
