import pool from "@/utils/db";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "No autorizado" });
  }

  try {
    const decoded = jwt.verify(token, "secreto_super_seguro");
    const [users] = await pool.query("SELECT id, username, email FROM users WHERE id = ?", [decoded.id]);

    if (users.length === 0) {
      return res.status(401).json({ error: "No autorizado" });
    }

    res.status(200).json(users[0]);
  } catch (error) {
    return res.status(401).json({ error: "Token inválido" });
  }
}
