import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Head from "next/head";

export default function Blog({ posts }) {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
      <Head>
        <title>Noticias de Anime - ExploraAnime</title>
        <meta name="description" content="Mantente al día con las últimas noticias de anime y descubre nuevos animes populares." />
        <meta name="keywords" content="anime, noticias, blog, populares" />
        <meta property="og:title" content="Noticias de Anime - ExploraAnime" />
        <meta property="og:description" content="Mantente al día con las últimas noticias de anime y descubre nuevos animes populares." />
        <meta property="og:image" content="/path/to/your/image.jpg" />
        <meta property="og:url" content="https://yourwebsite.com/blog" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Noticias de Anime - ExploraAnime" />
        <meta name="twitter:description" content="Mantente al día con las últimas noticias de anime y descubre nuevos animes populares." />
        <meta name="twitter:image" content="/path/to/your/image.jpg" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Blog",
            "name": "Noticias de Anime - ExploraAnime",
            "description": "Mantente al día con las últimas noticias de anime y descubre nuevos animes populares.",
            "url": "https://yourwebsite.com/blog",
            "blogPost": posts.map(post => ({
              "@type": "BlogPosting",
              "headline": post.title,
              "image": post.image_url,
              "datePublished": post.date,
              "description": post.summary,
              "url": `https://yourwebsite.com/blog/${post.id}`
            }))
          })}
        </script>
      </Head>
      <Navbar />
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-center mb-6">Noticias de Anime</h1>

        <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {posts.map((post) => (
            <li key={post.id} className="border p-4 bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition">
              <img src={post.image_url} alt={post.title} className="w-full h-48 object-cover rounded-md" loading="lazy" />
              <h2 className="font-bold text-xl mt-2">{post.title}</h2>
              <p className="text-sm text-gray-500">{post.date}</p>
              <p className="text-gray-700 dark:text-gray-300 mt-2">{post.summary}</p>
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
