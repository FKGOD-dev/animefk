import pool from "@/utils/db";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  const { user_id, action } = req.body;

  if (!user_id || !action) {
    return res.status(400).json({ error: "Faltan datos" });
  }

  try {
    let badgeId = null;

    if (action === "first_favorite") {
      const [result] = await pool.query("SELECT COUNT(*) AS count FROM favorites WHERE user_id = ?", [user_id]);
      if (result[0].count === 1) {
        badgeId = 1;
      }
    }

    if (action === "rate_10_animes") {
      const [result] = await pool.query("SELECT COUNT(*) AS count FROM ratings WHERE user_id = ?", [user_id]);
      if (result[0].count === 10) {
        badgeId = 2;
      }
    }

    if (action === "reach_50_points") {
      const [result] = await pool.query("SELECT points FROM users WHERE id = ?", [user_id]);
      if (result[0].points >= 50) {
        badgeId = 3;
      }
    }

    if (badgeId) {
      await pool.query("INSERT INTO user_badges (user_id, badge_id) VALUES (?, ?) ON DUPLICATE KEY UPDATE badge_id = badge_id", [user_id, badgeId]);
    }

    res.status(200).json({ message: "Insignia otorgada si se alcanzó el hito" });
  } catch (error) {
    console.error("Error en el sistema de insignias:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
}
