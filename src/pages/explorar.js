import { useState, useEffect, useRef } from "react";
import Navbar from "@/components/Navbar";

export default function Explorar({ animes }) {
  const [favorites, setFavorites] = useState([]);
  const [ratings, setRatings] = useState({});
  const [user, setUser] = useState(null);
  const [isClient, setIsClient] = useState(false);
  const [search, setSearch] = useState("");
  const [filterGenre, setFilterGenre] = useState("");
  const [filterYear, setFilterYear] = useState("");
  const [filterRating, setFilterRating] = useState("");
  const [page, setPage] = useState(1);
  const [visibleAnimes, setVisibleAnimes] = useState([]);
  const observer = useRef();

  useEffect(() => {
    setIsClient(true);
    setVisibleAnimes(animes.slice(0, 12));
    fetchUser();
    fetchFavorites();
    fetchAllRatings();
  }, []);

  const fetchUser = async () => {
    if (typeof window === "undefined") return;
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

  const fetchFavorites = async () => {
    if (!isClient) return;
    const token = localStorage.getItem("token");
    if (!token) return;

    const res = await fetch("/api/favorites", {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.ok) {
      const data = await res.json();
      setFavorites(data.map((fav) => fav.anime_id));
    }
  };

  const fetchAllRatings = async () => {
    if (!isClient) return;
    const res = await fetch("/api/rating");
    const data = await res.json();
    const ratingsMap = {};
    data.forEach((item) => {
      ratingsMap[item.anime_id] = item.avgRating || 0;
    });
    setRatings(ratingsMap);
  };

  const updateGamification = async (action) => {
    if (!user) return;
    await fetch("/api/gamification", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: user.id, action }),
    });
    fetchUser();
  };

  const updateBadges = async (action) => {
    if (!user) return;
    await fetch("/api/badges", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: user.id, action }),
    });
  };

  const toggleFavorite = async (anime) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Debes iniciar sesión para agregar a favoritos.");
      return;
    }

    if (favorites.includes(anime.mal_id)) {
      await fetch("/api/favorites", {
        method: "DELETE",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ anime_id: anime.mal_id }),
      });
      setFavorites(favorites.filter((id) => id !== anime.mal_id));
    } else {
      await fetch("/api/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          anime_id: anime.mal_id,
          title: anime.title,
          image_url: anime.images.jpg.image_url,
        }),
      });
      setFavorites([...favorites, anime.mal_id]);
      updateGamification("add_favorite");
      updateBadges("first_favorite");
    }
  };

  const rateAnime = async (anime_id, rating) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Debes iniciar sesión para valorar animes.");
      return;
    }

    const res = await fetch("/api/rating", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ anime_id, rating }),
    });

    if (res.ok) {
      alert("Valoración guardada correctamente");
      fetchAllRatings();
      updateGamification("rate_anime");
      updateBadges("rate_10_animes");
    } else {
      alert("Error al guardar la valoración");
    }
  };

  const handleScroll = () => {
    if (page * 12 < animes.length) {
      setVisibleAnimes(animes.slice(0, (page + 1) * 12));
      setPage((prev) => prev + 1);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-center mb-6">Explorar Animes</h1>

        {/* 🔹 Filtros */}
        <div className="flex flex-wrap gap-4 mb-6">
          <input type="text" placeholder="Buscar anime..." value={search} onChange={(e) => setSearch(e.target.value)} className="p-2 border rounded w-full md:w-1/4" />
          <select value={filterGenre} onChange={(e) => setFilterGenre(e.target.value)} className="p-2 border rounded">
            <option value="">Géneros</option>
            <option value="Action">Acción</option>
            <option value="Adventure">Aventura</option>
            <option value="Comedy">Comedia</option>
          </select>
        </div>

        {/* 🔹 Lista de Animes */}
        <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {visibleAnimes.map((anime) => (
            <li key={anime.mal_id} className="border p-2 hover:shadow-lg transition bg-white rounded-lg">
              <img src={anime.images.jpg.image_url} alt={anime.title} className="w-full h-48 object-cover rounded-md" />
              <h2 className="font-bold text-center mt-2">{anime.title}</h2>
              <p className="text-center text-sm text-gray-500">{anime.type} | ⭐ {anime.score}</p>
              <button onClick={() => toggleFavorite(anime)} className="mt-2 p-2 w-full bg-blue-500 text-white rounded">
                {favorites.includes(anime.mal_id) ? "Quitar de Favoritos" : "Añadir a Favoritos"}
              </button>
            </li>
          ))}
        </ul>

        {/* 🔹 Botón para cargar más animes */}
        {page * 12 < animes.length && (
          <button className="mt-6 mx-auto block bg-blue-600 text-white px-4 py-2 rounded" onClick={handleScroll}>
            Cargar más
          </button>
        )}
      </div>
    </div>
  );
}

export async function getServerSideProps() {
  const res = await fetch("https://api.jikan.moe/v4/top/anime");
  const data = await res.json();
  return { props: { animes: data.data || [] } };
}
