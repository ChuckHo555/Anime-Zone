"use client";

import React, { useState } from "react";
import { AnimeCardData } from "@/util/constants";

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
  const [review, setReview] = useState(anime.userReview);
  const [score, setScore] = useState(anime.userScore);

  const handleReviewChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newReview = e.target.value;
    setReview(newReview);
    onReviewUpdate(newReview);
  };

  const handleScoreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newScore = parseFloat(e.target.value);
    setScore(newScore);
    onScoreUpdate(newScore);
  };
    console.log("status data:", anime.status)
  return (
    
    <div className="flex w-full p-2 bg-gray-800 rounded-lg shadow-md items-stretch gap-2">
      {/* Anime Thumbnail */}
      
      <div className="flex-shrink-0">
        <img
          src={anime.image}
          alt={anime.title}
          className="h-full w-32 rounded-md object-cover border border-gray-700"
        />
      </div>

      {/* Content Section (Title, Genres, TextField) */}
      <div className="flex flex-col flex-1 justify-between">
        {/* Title and Genres */}
        <div className="flex flex-col">
          <h3 className="text-lg font-semibold text-white">{anime.title}</h3>
          <p className="text-sm text-gray-400">{anime.genres.join(", ")}</p>
        </div>

        {/* Review Text Area */}
        <textarea
          className="w-[85%] p-2 bg-gray-700 text-white rounded-md resize-none border border-gray-700 focus:outline-none focus:ring focus:ring-blue-500"
          rows={4}
          value={review}
          onChange={handleReviewChange}
          placeholder="Write your review..."
        />
      </div>

      {/* Right Section (3 Square Containers Side by Side) */}
      <div className="flex gap-2 h-full items-stretch">
        {/* Anime Score */}
        <div className="flex flex-col justify-center items-center bg-blue-700 aspect-square h-full rounded-md">
          <p className="text-sm text-gray-100">Anime Score</p>
          <p className="text-lg font-bold text-white">{anime.animeScore}</p>
        </div>

        {/* User Score */}
        <div className="flex flex-col justify-center items-center bg-green-700 aspect-square h-full rounded-md">
          <label
            htmlFor={`user-score-${anime.id}`}
            className="text-sm text-gray-100"
          >
            Your Score
          </label>
          <input
            id={`user-score-${anime.id}`}
            type="number"
            min="0"
            max="10"
            step="0.1"
            value={score}
            onChange={handleScoreChange}
            className="mt-1 w-16 text-center bg-gray-900 text-white rounded-md border border-gray-700 focus:outline-none focus:ring focus:ring-green-500"
          />
        </div>

        {/* Progress Message */}
        <div className="flex flex-col justify-center items-center bg-purple-700 aspect-square h-full rounded-md">
          <p className="text-sm font-medium text-gray-100">
            {anime.status || "Not Watched"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default NoteCard;
