"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import AnimeCard from "@/app/components/Card";
import { AnimeCardProps } from "@/util/constants"; 

const RecommendationList = () => {
  const { user } = useUser();
  const userId = user?.id;

  // Define the type for recommendations explicitly
  const [recommendations, setRecommendations] = useState<AnimeCardProps["anime"][]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecommendations = async () => {
      if (!userId) {
        setError("You need to log in to view recommendations.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/getRecommendation?userId=${userId}`);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to fetch recommendations");
        }
        const data = await response.json();
        setRecommendations(data);
      } catch (err: any) {
        console.error("Error fetching recommendations:", err.message || err);
        setError(err.message || "Failed to fetch recommendations. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [userId]);

  if (loading) {
    return <p className="text-center text-white">Loading recommendations...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  if (recommendations.length === 0) {
    return <p className="text-center text-white">No recommendations available.</p>;
  }

  return (
    <div className="flex flex-wrap justify-center items-start p-4 gap-6 w-full">
      {recommendations.map((anime) => (
        <AnimeCard key={anime.id} anime={anime} />
      ))}
    </div>
  );
};

export default RecommendationList;
