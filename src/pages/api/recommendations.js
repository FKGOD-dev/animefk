import pool from "@/utils/db";

export default async function handler(req, res) {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "No autorizado" });
  }

  try {
    const decoded = jwt.verify(token, "secreto_super_seguro");
    const userId = decoded.id;

    // Obtener los géneros de los animes favoritos del usuario
    const [favoriteGenres] = await pool.query(`
      SELECT g.name
      FROM favorites f
      JOIN anime_genres ag ON f.anime_id = ag.anime_id
      JOIN genres g ON ag.genre_id = g.id
      WHERE f.user_id = ?
    `, [userId]);

    // Obtener recomendaciones basadas en los géneros favoritos
    const [recommendations] = await pool.query(`
      SELECT a.*
      FROM animes a
      JOIN anime_genres ag ON a.id = ag.anime_id
      JOIN genres g ON ag.genre_id = g.id
      WHERE g.name IN (?)
      GROUP BY a.id
      ORDER BY a.score DESC
      LIMIT 10
    `, [favoriteGenres.map(g => g.name)]);

    res.status(200).json(recommendations);
  } catch (error) {
    console.error("Error al obtener recomendaciones:", error);
    res.status(500).json({ error: "Error al obtener recomendaciones" });
  }
}