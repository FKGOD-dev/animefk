import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Image from "next/image";
import Link from "next/link";
import Head from "next/head";

export default function Explorar({ animes = [] }) {
  const [favorites, setFavorites] = useState([]);
  const [ratings, setRatings] = useState({});
  const [user, setUser] = useState(null);
  const [search, setSearch] = useState("");
  const [filterGenre, setFilterGenre] = useState("");
  const [filterYear, setFilterYear] = useState("");
  const [filterRating, setFilterRating] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [page, setPage] = useState(1);
  const [recommendations, setRecommendations] = useState([]);
  const animesPerPage = 12;

  useEffect(() => {
    fetchUser();
    fetchFavorites();
    fetchAllRatings();
    fetchRecommendations();

    // 🔹 Cargar el modo oscuro guardado
    const storedDarkMode = localStorage.getItem("darkMode") === "true";
    setDarkMode(storedDarkMode);
    document.body.classList.toggle("dark", storedDarkMode);
  }, []);

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

  const fetchFavorites = async () => {
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
    const res = await fetch("/api/rating");
    const data = await res.json();
    const ratingsMap = {};
    data.forEach((item) => {
      ratingsMap[item.anime_id] = item.avgRating || 0;
    });
    setRatings(ratingsMap);
  };

  const fetchRecommendations = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const res = await fetch("/api/recommendations", {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.ok) {
      const data = await res.json();
      setRecommendations(data);
    }
  };

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem("darkMode", newMode);
    document.body.classList.toggle("dark", newMode);
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
          image_url: anime.images?.jpg?.image_url || "/placeholder.jpg",
        }),
      });
      setFavorites([...favorites, anime.mal_id]);
    }
  };

  const filteredAnimes = (animes || [])
    .filter((anime) => {
      const matchesSearch = anime.title?.toLowerCase().includes(search.toLowerCase());
      const matchesGenre = filterGenre ? anime.genres?.some((g) => g.name === filterGenre) : true;
      const matchesYear = filterYear ? anime.aired?.prop?.from?.year?.toString() === filterYear : true;
      const matchesRating = filterRating ? anime.score >= parseFloat(filterRating) : true;
      return matchesSearch && matchesGenre && matchesYear && matchesRating;
    })
    .slice((page - 1) * animesPerPage, page * animesPerPage); // 🔹 Paginación

  return (
    <div className={`min-h-screen ${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"}`}>
      <Head>
        <title>Explorar Animes - ExploraAnime</title>
        <meta name="description" content="Explora una amplia variedad de animes y encuentra tus favoritos." />
        <meta name="keywords" content="anime, explorar, favoritos, calificaciones" />
        <meta property="og:title" content="Explorar Animes - ExploraAnime" />
        <meta property="og:description" content="Explora una amplia variedad de animes y encuentra tus favoritos." />
        <meta property="og:image" content="/path/to/your/image.jpg" />
        <meta property="og:url" content="https://yourwebsite.com/explorar" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Explorar Animes - ExploraAnime" />
        <meta name="twitter:description" content="Explora una amplia variedad de animes y encuentra tus favoritos." />
        <meta name="twitter:image" content="/path/to/your/image.jpg" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Explorar Animes - ExploraAnime",
            "description": "Explora una amplia variedad de animes y encuentra tus favoritos.",
            "url": "https://yourwebsite.com/explorar",
          })}
        </script>
      </Head>
      <Navbar />
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Explorar Animes</h1>
          <button onClick={toggleDarkMode} className="p-2 bg-gray-800 text-white rounded">
            {darkMode ? "☀️ Modo Claro" : "🌙 Modo Oscuro"}
          </button>
        </div>

        {/* 🔹 Filtros */}
        <div className="flex flex-wrap gap-4 mb-6">
          <input type="text" placeholder="Buscar anime..." value={search} onChange={(e) => setSearch(e.target.value)} className="p-2 border rounded w-full md:w-1/4" />
          <select value={filterGenre} onChange={(e) => setFilterGenre(e.target.value)} className="p-2 border rounded">
            <option value="">Géneros</option>
            <option value="Action">Acción</option>
            <option value="Adventure">Aventura</option>
            <option value="Comedy">Comedia</option>
          </select>
          <select value={filterYear} onChange={(e) => setFilterYear(e.target.value)} className="p-2 border rounded">
            <option value="">Año</option>
            {Array.from(new Set(animes.map((anime) => anime.aired?.prop?.from?.year)))
              .filter(Boolean)
              .sort((a, b) => b - a)
              .map((year) => (
                <option key={year} value={year}>{year}</option>
              ))}
          </select>
          <select value={filterRating} onChange={(e) => setFilterRating(e.target.value)} className="p-2 border rounded">
            <option value="">Calificación</option>
            <option value="9">9+ ⭐</option>
            <option value="8">8+ ⭐</option>
            <option value="7">7+ ⭐</option>
          </select>
        </div>

        {/* 🔹 Lista de Animes */}
        <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredAnimes.length > 0 ? (
            filteredAnimes.map((anime) => (
              <li key={anime.mal_id} className="border p-2 hover:shadow-lg transition bg-white dark:bg-gray-800 rounded-lg">
                <Link href={`/detalle/${anime.mal_id}`} legacyBehavior>
                  <a>
                    <Image src={anime.images?.jpg?.image_url || "/placeholder.jpg"} alt={anime.title} width={300} height={400} className="w-full h-48 object-cover rounded-md" loading="lazy" />
                    <h2 className="font-bold text-center mt-2">{anime.title}</h2>
                    <p className="text-center text-sm">{anime.type} | ⭐ {anime.score}</p>
                  </a>
                </Link>
              </li>
            ))
          ) : (
            <p className="text-center text-gray-500 dark:text-gray-300 col-span-full">No se encontraron animes.</p>
          )}
        </ul>

        {/* 🔹 Recomendaciones Personalizadas */}
        {recommendations.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-4">Recomendaciones Personalizadas</h2>
            <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {recommendations.map((anime) => (
                <li key={anime.mal_id} className="border p-2 hover:shadow-lg transition bg-white dark:bg-gray-800 rounded-lg">
                  <Link href={`/detalle/${anime.mal_id}`} legacyBehavior>
                    <a>
                      <Image src={anime.images?.jpg?.image_url || "/placeholder.jpg"} alt={anime.title} width={300} height={400} className="w-full h-48 object-cover rounded-md" loading="lazy" />
                      <h2 className="font-bold text-center mt-2">{anime.title}</h2>
                      <p className="text-center text-sm">{anime.type} | ⭐ {anime.score}</p>
                    </a>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* 🔹 Paginación */}
        <div className="flex justify-center mt-6">
          <button disabled={page === 1} onClick={() => setPage(page - 1)} className="px-4 py-2 bg-blue-500 text-white rounded mx-2">Anterior</button>
          <button disabled={filteredAnimes.length < animesPerPage} onClick={() => setPage(page + 1)} className="px-4 py-2 bg-blue-500 text-white rounded mx-2">Siguiente</button>
        </div>
      </div>
    </div>
  );
}

// 🔹 Obtener los datos de los animes desde la API
export async function getServerSideProps() {
  const res = await fetch("https://api.jikan.moe/v4/top/anime");
  const data = await res.json();
  return { props: { animes: data.data || [] } };
}
