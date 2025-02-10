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
    let points = 0;

    // Asignar puntos según la acción
    if (action === "add_favorite") points = 10;
    if (action === "rate_anime") points = 5;
    if (action === "explore_anime") points = 3;

    // Actualizar puntos y nivel del usuario
    await pool.query(
      "UPDATE users SET points = points + ?, level = FLOOR(points / 100) + 1 WHERE id = ?",
      [points, user_id]
    );

    res.status(200).json({ message: "Puntos actualizados correctamente" });
  } catch (error) {
    console.error("Error en la gamificación:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
}
