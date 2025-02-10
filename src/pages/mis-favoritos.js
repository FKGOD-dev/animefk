import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { useRouter } from "next/router";

export default function MisFavoritos() {
  const [favorites, setFavorites] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchFavorites = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login"); // 🔹 Si no está logueado, redirigir al login
        return;
      }

      const res = await fetch("/api/favorites", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (res.ok) {
        setFavorites(data);
      } else {
        console.error("Error al obtener favoritos:", data.error);
      }
    };

    fetchFavorites();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-center mb-6">Mis Favoritos</h1>

        {favorites.length > 0 ? (
          <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {favorites.map((anime) => (
              <li key={anime.anime_id} className="border p-2 hover:shadow-lg transition bg-white rounded-lg">
                <img src={anime.image_url} alt={anime.title} className="w-full h-48 object-cover rounded-md" />
                <h2 className="font-bold text-center mt-2">{anime.title}</h2>
                <button
                  className="mt-2 p-2 w-full bg-red-500 text-white rounded hover:bg-red-700"
                  onClick={async () => {
                    const token = localStorage.getItem("token");
                    await fetch("/api/favorites", {
                      method: "DELETE",
                      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                      body: JSON.stringify({ anime_id: anime.anime_id }),
                    });
                    setFavorites(favorites.filter((fav) => fav.anime_id !== anime.anime_id));
                  }}
                >
                  Quitar de Favoritos
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-gray-500">No tienes animes en favoritos.</p>
        )}
      </div>
    </div>
  );
}
