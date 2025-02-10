import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";

export default function Blog({ posts }) {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-center mb-6">Noticias de Anime</h1>

        <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {posts.map((post) => (
            <li key={post.id} className="border p-4 bg-white rounded-lg shadow hover:shadow-lg transition">
              <img src={post.image_url} alt={post.title} className="w-full h-48 object-cover rounded-md" />
              <h2 className="font-bold text-xl mt-2">{post.title}</h2>
              <p className="text-sm text-gray-500">{post.date}</p>
              <p className="text-gray-700 mt-2">{post.summary}</p>
              <a href={`/blog/${post.id}`} className="block mt-2 text-blue-500 hover:underline">
                Leer más...
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// 🔹 Obtener artículos desde la API
export async function getServerSideProps() {
  const res = await fetch("https://api.jikan.moe/v4/anime");
  const data = await res.json();

  // 🔹 Simular artículos de blog basados en animes populares
  const posts = data.data.slice(0, 6).map((anime, index) => ({
    id: index + 1,
    title: anime.title,
    date: new Date().toLocaleDateString(),
    summary: `Descubre más sobre ${anime.title}, uno de los animes más populares actualmente.`,
    image_url: anime.images.jpg.image_url,
  }));

  return {
    props: { posts },
  };
}
