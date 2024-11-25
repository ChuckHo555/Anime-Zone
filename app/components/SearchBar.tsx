"use client";

import { useEffect, useState } from "react";
import AnimeCard from "@/app/components/Card";
import { AnimeCardProps } from "@/util/constants";

export default function SearchBar({
  placeholder = "Search for an anime...",
}: {
  placeholder?: string;
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [displayedTerm, setDisplayedTerm] = useState(""); 
  const [animeList, setAnimeList] = useState<AnimeCardProps["anime"][]>([]);

  const fetchAnimes = async (search?: string) => {
    const url = search
      ? `/api/getAnime?search=${encodeURIComponent(search)}`
      : `/api/getAnime`;

    const response = await fetch(url);
    if (!response.ok) {
      console.error("Failed to fetch animes");
      return;
    }
    const data = await response.json();
    setAnimeList(data);
  };

  useEffect(() => {
    fetchAnimes(); 
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    setDisplayedTerm(searchTerm); 
    fetchAnimes(searchTerm); 
  };

  return (
    <div className="w-full flex flex-col items-center gap-4">

      <form
        onSubmit={handleSearch}
        className="flex items-center justify-center w-full gap-2"
      >
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={placeholder}
          className="w-3/4 px-4 py-2 text-black rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Search
        </button>
      </form>

      {displayedTerm && (
        <p className="text-gray-400 self-start pl-6 w-full">
          Results for: <span className="text-white font-bold">{displayedTerm}</span>
        </p>
      )}

      {animeList.length === 0 && displayedTerm.trim() && (
        <p className="text-gray-400 w-full text-center mt-4">
          No results found for <span className="text-white font-bold">{displayedTerm}</span>.
        </p>
      )}

      <div
        className="flex flex-wrap justify-center items-start
    p-4 gap-6 w-full"
      >
        {animeList.map((anime) => (
          <AnimeCard key={anime.id} anime={anime} />
        ))}
      </div>
    </div>
  );
}
