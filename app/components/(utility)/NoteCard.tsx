"use client";

import { useState, useEffect } from "react";
import { AnimeCardData } from "@/util/constants";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";

interface AnimeCardProps {
  anime: AnimeCardData;
  onReviewUpdate: (review: string) => void;
  onScoreUpdate: (score: number) => void;
}

const NoteCard: React.FC<AnimeCardProps> = ({
  anime,
  onReviewUpdate,
  onScoreUpdate,
}) => {
  const [review, setReview] = useState<string>("");
  const [score, setScore] = useState<number>(0);
  const [userId, setUserId] = useState<string | null>(null);

  const { user } = useUser();

  useEffect(() => {
    if (user) {
      setUserId(user.id);
    }
  }, [user]);

  useEffect(() => {
    const fetchSavedData = async () => {
      if (!userId || !anime.id) return;

      try {
        const res = await fetch(
          `/api/getNotes?userId=${userId}&animeId=${anime.id}`
        );
        if (res.ok) {
          const data = await res.json();
          setReview(data.note || ""); 
          setScore(data.userRating || 0); 
          console.log("Previous Note:", data.note  )
          console.log("Previous Rating:", data.userRating  )
        } else {
          console.error(`Failed to fetch saved data for anime ID ${anime.id}`);
        }
      } catch (error) {
        console.error(`Error fetching saved data for anime ID ${anime.id}:`, error);
      }
    
    };

    fetchSavedData();
  }, [userId, anime.id]);

  const saveChanges = async () => {
    if (!userId) {
      console.error("UserId is unavailable. Cannot save changes.");
      return;
    }

    try {
      const res = await fetch(`/api/getNotes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          animeId: anime.id,
          note: review || "", 
          userRating: score || 0, 
        }),
      });

      if (!res.ok) {
        console.error(`Failed to save changes for anime ID ${anime.id}`);
      } else {
        console.log(`Changes saved successfully for anime ID ${anime.id}`);
      }
    } catch (error) {
      console.error(`Error saving changes for anime ID ${anime.id}:`, error);
    }
  };

  const handleReviewChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setReview(e.target.value);
    onReviewUpdate(e.target.value);
  };

  const handleSaveReview = () => {
    saveChanges(); 
  };

  const handleScoreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newScore = parseInt(e.target.value, 10);
    setScore(newScore);
    onScoreUpdate(newScore);
  };

  const handleSaveScore = () => {
    saveChanges(); 
  };

  return (
    <div className="flex w-full p-4 bg-gray-800 rounded-lg shadow-md items-stretch gap-4">
      <Link href={`?animeId=${anime.id}`} className="flex-shrink-0">
        <img
          src={anime.image}
          alt={anime.title}
          className="h-full w-40 rounded-md object-cover border border-gray-700"
        />
      </Link>

      <div className="flex flex-col flex-1 gap-4">
        <div className="flex flex-col">
          <h3 className="text-xl font-bold text-white">{anime.title}</h3>
          <p className="text-sm text-gray-400 truncate">
            {anime.genres.join(", ")}
          </p>
        </div>

        <div className="relative flex-grow">
          <textarea
            className="w-full h-full p-2 bg-gray-700 text-white rounded-md resize-none border border-gray-700 focus:outline-none focus:ring focus:ring-blue-500 pr-12"
            value={review}
            onChange={handleReviewChange}
            placeholder="Write your review..."
          />
          <button
            onClick={handleSaveReview}
            className="absolute bottom-2 right-2 bg-blue-600 text-white px-2 py-1 rounded-md hover:bg-blue-500 transition-transform transform hover:scale-105 text-xs"
          >
            Save
          </button>
        </div>
      </div>

      <div className="flex flex-col justify-between gap-2">
        <div className="flex flex-col justify-center items-center bg-blue-700 h-28 w-28 rounded-md">
          <p className="text-sm text-gray-100">Anime Score</p>
          <p className="text-lg font-bold text-white">{anime.animeScore}</p>
        </div>

        <div className="flex flex-col justify-center items-center bg-green-700 h-28 w-28 rounded-md relative">
          <label
            htmlFor={`user-score-${anime.id}`}
            className="text-sm text-gray-100 mb-1"
          >
            Your Score
          </label>
          <input
            id={`user-score-${anime.id}`}
            type="number"
            min="0"
            max="100"
            value={score}
            onChange={handleScoreChange}
            className="mt-1 w-16 text-center bg-gray-900 text-white rounded-md border border-gray-700 focus:outline-none focus:ring focus:ring-green-500"
          />
          <button
            onClick={handleSaveScore}
            className="absolute bottom-2 bg-green-600 text-white px-1 py-0 rounded-md hover:bg-green-500 transition-transform transform hover:scale-105 text-xs"
          >
            Save
          </button>
        </div>

        <div className="flex flex-col justify-center items-center bg-red-700 h-28 w-28 rounded-md">
          <p className="text-sm font-medium text-gray-100">
            {anime.status || "Not Watched"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default NoteCard;
