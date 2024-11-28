import Link from "next/link";
import { AnimeCardProps } from "@/util/constants";

const AnimeCard = ({ anime }: AnimeCardProps) => {
  return (
    <Link
      href={`?animeId=${anime.id}`}
      className="anime-card bg-gray-800 border border-gray-600 rounded-lg p-4 w-64 flex flex-col items-center transition-transform hover:scale-105"
    >
      <img
        src={anime.coverImage.large}
        alt={anime.title.english || anime.title.romaji}
        className="w-full h-80 object-cover rounded-md"
      />
      <h2 className="text-white text-lg font-bold mt-2 text-center">
        {anime.title.english || anime.title.romaji}
      </h2>
      <p className="text-gray-400 text-sm mt-1">Score: {anime.averageScore}</p>
      <p className="text-gray-300 text-sm mt-1 text-center">
        Genres: {anime.genres.join(", ")}
      </p>
    </Link>
  );
};

export default AnimeCard;
