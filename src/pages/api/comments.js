import pool from "@/utils/db";

export default async function handler(req, res) {
  const { method } = req;

  switch (method) {
    case "GET":
      return getComments(req, res);
    case "POST":
      return addComment(req, res);
    default:
      res.setHeader("Allow", ["GET", "POST"]);
      return res.status(405).end(`Method ${method} Not Allowed`);
  }
}

const getComments = async (req, res) => {
  const { anime_id } = req.query;

  try {
    const [comments] = await pool.query("SELECT * FROM comments WHERE anime_id = ?", [anime_id]);
    res.status(200).json(comments);
  } catch (error) {
    console.error("Error al obtener comentarios:", error);
    res.status(500).json({ error: "Error al obtener comentarios" });
  }
};

const addComment = async (req, res) => {
  const { anime_id, user_id, comment } = req.body;

  if (!anime_id || !user_id || !comment) {
    return res.status(400).json({ error: "Todos los campos son obligatorios" });
  }

  try {
    await pool.query("INSERT INTO comments (anime_id, user_id, comment) VALUES (?, ?, ?)", [anime_id, user_id, comment]);
    res.status(201).json({ message: "Comentario agregado exitosamente" });
  } catch (error) {
    console.error("Error al agregar comentario:", error);
    res.status(500).json({ error: "Error al agregar comentario" });
  }
};