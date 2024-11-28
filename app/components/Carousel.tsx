"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { AnimeCardProps } from "@/util/constants";

interface AnimeCarouselProps {
  animes: AnimeCardProps["anime"][];
}

const AnimeCarousel = ({ animes }: AnimeCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (animes.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % animes.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [animes]);

  if (animes.length === 0) {
    return <div className="text-white text-center">Loading...</div>;
  }

  return (
    <div className="relative w-full h-[600px] overflow-hidden">
      {animes.map((anime, index) => (
        <div
          key={anime.id}
          className={`absolute inset-0 flex items-center justify-between transition-opacity duration-1000 ${
            index === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
          {/* Background with Image and Gradient */}
          <div className="absolute inset-0">
            <img
              src={anime.coverImage.large}
              alt={anime.title.romaji}
              className="w-full h-full object-cover opacity-30"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black"></div>
          </div>

          {/* Content Section */}
          <div className="relative z-20 flex items-center justify-between w-full px-16">
            {/* Anime Details */}
            <div className="flex-1">
              <h2 className="text-5xl font-extrabold mb-4">
                {anime.title.english || anime.title.romaji}
              </h2>
              <p className="text-gray-300 text-lg mb-4">
                Genres: {anime.genres.join(", ")}
              </p>
              <p className="text-orange-400 font-semibold text-xl mb-8">
                Score: {anime.averageScore}
              </p>
              <Link
                href={`/protected/HomePage?modal=${anime.id}`}
                scroll={false}
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-6 rounded-lg"
              >
                More Details
              </Link>
            </div>

            {/* Anime Image */}
            <div className="flex-1 flex justify-center items-center">
              <img
                src={anime.coverImage.large}
                alt={anime.title.romaji}
                className="w-[400px] h-[500px] object-cover rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AnimeCarousel;
