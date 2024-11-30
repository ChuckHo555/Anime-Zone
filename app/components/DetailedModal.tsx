"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";

interface DetailedAnimeModalProps {
  animeId: string;
}

const DetailedAnimeModal = ({ animeId }: DetailedAnimeModalProps) => {
  const { user } = useUser();
  const userId = user?.id;
  const [animeDetails, setAnimeDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notification, setNotification] = useState<string | null>(null);
  const [episodesWatched, setEpisodesWatched] = useState<number>(0);
  const [progress, setProgress] = useState<string>("Not Watched");
  const [isInWatchList, setIsInWatchList] = useState<boolean>(false);
  const [isInFavorites, setIsInFavorites] = useState<boolean>(false);
  const router = useRouter();

  const stripHTML = (str: string) => {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = str;
    return tempDiv.textContent || tempDiv.innerText || "";
  };
  const checkUserLists = async () => {
    if (!userId) return;
  
    try {
      const response = await fetch(`/api/manageYourList?userId=${userId}&animeId=${animeId}`);
      if (!response.ok) {
        throw new Error("Failed to check user lists.");
      }
      const { watchLater, favorites } = await response.json();
      setIsInWatchList(watchLater); // This must correctly reflect the DB state
      setIsInFavorites(favorites);
    } catch (error) {
      console.error("Error checking user lists:", error);
    }
  };
  
  const updateProgress = async (watched: number) => {
    if (watched > (animeDetails?.episodes || 0)) return;

    try {
      const response = await fetch("/api/getViewingStatus", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          animeId,
          episodesWatched: watched,
          totalEpisodes: animeDetails.episodes || 0,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update viewing status.");
      }

      const status =
        watched === 0
          ? "Not Watched"
          : watched >= (animeDetails.episodes || 0)
          ? "Finished"
          : "In Progress";

      setProgress(status);
      handleNotification("Viewing progress updated!");
    } catch (error) {
      console.error("Error updating progress:", error);
      handleNotification("Failed to update progress. Please try again.");
    }
  };

  useEffect(() => {
    const fetchAnimeDetails = async () => {
      try {
        const response = await fetch(`/api/getAnime?id=${animeId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch anime details");
        }
        const data = await response.json();
        setAnimeDetails(data);

        // Check if anime is in Watch List or Favorites
        if (userId) {
          const listResponse = await fetch(
            `/api/manageYourList?userId=${userId}&animeId=${animeId}`
          );

          if (listResponse.ok) {
            const { isInWatchLater, isInFavorites } = await listResponse.json();
            setIsInWatchList(isInWatchLater);
            setIsInFavorites(isInFavorites);
          }

          // Fetch existing viewing status
          const statusResponse = await fetch(
            `/api/getViewingStatus?userId=${userId}&animeId=${animeId}`
          );

          if (statusResponse.ok) {
                        const { episodesWatched, status } = await statusResponse.json();
            setEpisodesWatched(episodesWatched || 0);
            setProgress(status || "Not Watched");
          }
        }
      } catch (error) {
        console.error("Error fetching anime details:", error);
        setError("Failed to load anime details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchAnimeDetails();
  }, [animeId, userId]);

  const handleNotification = (message: string) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleAction = async (listType: "favorites" | "watchLater", isAdding: boolean) => {
    if (!userId) {
      handleNotification("You need to log in to perform this action.");
      return;
    }
  
    try {
      const response = await fetch("/api/manageYourList", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ animeId, userId, listType, genres }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update list.");
      }
  
      const { message } = await response.json();
  
      if (listType === "watchLater") {
        setIsInWatchList(!isInWatchList);
        handleNotification(isAdding ? "Added to Watch Later!" : "Removed from Watch Later!");
      } else if (listType === "favorites") {
        setIsInFavorites(!isInFavorites);
        handleNotification(isAdding ? "Added to Favorites!" : "Removed from Favorites!");
      }
      
    } catch (error) {
      console.error("Error updating list:", error);
      handleNotification("An error occurred. Please try again.");
    }
  };
  
  

  const handleEpisodesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const watched = parseInt(e.target.value, 10) || 0;
    if (watched <= (animeDetails?.episodes || 0)) {
      setEpisodesWatched(watched);
      updateProgress(watched);
    }
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.value = ""; // Clear the input on focus
  };

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white">
        <div>
          <p>{error}</p>
          <button
            onClick={() => router.back()}
            className="mt-4 bg-red-500 px-4 py-2 rounded hover:bg-red-600"
          >
            Back
          </button>
        </div>
      </div>
    );
  }

  if (!animeDetails) {
    return null;
  }

  const {
    title,
    description,
    genres,
    averageScore,
    coverImage,
    episodes,
    season,
    seasonYear,
  } = animeDetails;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-75 flex justify-center items-center overflow-auto">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={coverImage.large}
          alt={title.romaji}
          className="w-full h-full object-cover blur-lg"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black"></div>
      </div>

      {/* Foreground Content */}
      <div className="relative z-10 bg-gray-900 text-white w-[95%] max-w-5xl mx-auto rounded-lg overflow-hidden shadow-lg flex">
        {/* Left Column - Image */}
        <div className="w-1/3 p-4 flex justify-center items-start">
          <img
            src={coverImage.large}
            alt={title.romaji}
            className="w-full h-auto rounded-lg shadow-md"
          />
        </div>

        {/* Right Column */}
        <div className="w-2/3 p-4 flex flex-col gap-4">
          {/* Name */}
          <h2 className="text-3xl font-bold">{title.english || title.romaji}</h2>

          {/* Details */}
          <div className="flex flex-wrap gap-2 text-sm text-gray-300">
            <p>
              <strong>Genres:</strong> {genres.join(", ")}
            </p>
            <p>
              <strong>Score:</strong> {averageScore || "N/A"}
            </p>
            <p>
              <strong>Aired Date:</strong> {season || "Unknown"} {seasonYear || ""}
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mt-2 relative w-full">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-300">
                Progress: {episodesWatched}/{episodes || 0} episodes
              </p>
              <p className="text-sm text-gray-400 font-semibold">{progress}</p>
              <input
                type="number"
                min="0"
                max={episodes || 0}
                value={episodesWatched}
                onFocus={handleFocus}
                onChange={handleEpisodesChange}
                className="w-16 bg-gray-800 text-white text-center p-1 rounded-md border border-gray-700 text-sm"
              />
            </div>
            <div className="relative w-full h-2 mt-2 bg-gray-700 rounded-lg overflow-hidden">
              <div
                className="absolute h-full bg-blue-500 transition-all "
                style={{
                  width: `${Math.min(
                    (episodesWatched / (episodes || 1)) * 100,
                    100
                  )}%`,
                }}
              ></div>
            </div>
          </div>

          {/* Description */}
          <div className="flex-grow">
            <h3 className="text-lg font-semibold mb-2">Description:</h3>
            <p className="text-sm text-gray-200 leading-relaxed">
              {stripHTML(description)}
            </p>
          </div>

          {/* Buttons */}
          <div className="flex justify-start gap-4">
  <button
    className={`flex-1 ${
      isInWatchList ? "bg-red-600" : "bg-blue-600"
    } hover:${isInWatchList ? "bg-red-700" : "bg-blue-700"} text-white py-3 px-6 rounded-md text-center`}
    onClick={() => handleAction("watchLater", !isInWatchList)}
  >
    {isInWatchList ? "Remove from Watch List" : "Add to Watch List"}
  </button>
  <button
    className={`flex-1 ${
      isInFavorites ? "bg-red-600" : "bg-orange-600"
    } hover:${isInFavorites ? "bg-red-700" : "bg-orange-700"} text-white py-3 px-6 rounded-md text-center`}
    onClick={() => handleAction("favorites", !isInFavorites)}
  >
    {isInFavorites ? "Remove from Favorites" : "Add to Favorites"}
  </button>
</div>

        </div>

        {/* Close Button */}
        <button
          onClick={() => router.back()}
          className="absolute top-4 right-4 bg-red-500 text-white rounded-full p-2 hover:bg-red-600"
        >
          ×
        </button>
      </div>

      {/* Notification */}
      {notification && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-6 py-2 rounded-md shadow-lg">
          {notification}
        </div>
      )}
    </div>
  );
};

export default DetailedAnimeModal;
