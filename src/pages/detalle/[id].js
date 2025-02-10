import Navbar from "@/components/Navbar";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";

export default function AnimeDetalle({ anime }) {
  const router = useRouter();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchComments();
    fetchUser();
  }, []);

  const fetchComments = async () => {
    const res = await fetch(`/api/comments?anime_id=${anime.mal_id}`);
    const data = await res.json();
    setComments(data);
  };

  const fetchUser = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const res = await fetch("/api/auth/me", {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.ok) {
      const data = await res.json();
      setUser(data);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      alert("Debes iniciar sesión para dejar un comentario.");
      return;
    }

    const res = await fetch("/api/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        anime_id: anime.mal_id,
        user_id: user.id,
        comment: newComment,
      }),
    });

    if (res.ok) {
      setNewComment("");
      fetchComments();
    } else {
      alert("Error al agregar comentario");
    }
  };

  if (router.isFallback) {
    return <h1 className="text-center text-xl">Cargando...</h1>;
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
      <Navbar />
      <div className="max-w-3xl mx-auto p-6">
        <h1 className="text-4xl font-bold text-center">{anime.title}</h1>
        <img src={anime.images.jpg.image_url} alt={anime.title} className="w-full rounded-lg shadow-lg my-4" />
        <p className="text-lg">{anime.synopsis}</p>
        <p className="mt-4"><strong>Género:</strong> {anime.genres.map((genre) => genre.name).join(", ")}</p>
        <p><strong>Calificación:</strong> {anime.score}/10 ⭐</p>
        <p><strong>Año de estreno:</strong> {anime.aired.prop.from.year || "Desconocido"}</p>

        {/* 🔹 Comentarios */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Comentarios</h2>
          <ul className="space-y-4">
            {comments.map((comment) => (
              <li key={comment.id} className="border p-4 bg-white dark:bg-gray-800 rounded-lg">
                <p>{comment.comment}</p>
                <p className="text-sm text-gray-500">Usuario: {comment.user_id}</p>
              </li>
            ))}
          </ul>

          {user && (
            <form onSubmit={handleCommentSubmit} className="mt-4">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Deja tu comentario..."
                className="w-full p-2 border rounded"
                rows="4"
              ></textarea>
              <button type="submit" className="mt-2 px-4 py-2 bg-blue-500 text-white rounded">Enviar</button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

// 🔹 Obtener los datos de un anime desde la API
export async function getServerSideProps({ params }) {
  const res = await fetch(`https://api.jikan.moe/v4/anime/${params.id}`);
  const data = await res.json();

  return {
    props: { anime: data.data },
  };
}
