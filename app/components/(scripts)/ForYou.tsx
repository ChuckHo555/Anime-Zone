"use client";

import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import AnimeCard from "@/app/components/(utility)/Card";
import Tabs from "@/app/components/(utility)/Tab";

const RecommendationSeasonalSection = () => {
  const { user } = useUser();
  const userId = user?.id;

  const [activeTab, setActiveTab] = useState("Seasonal");
  const [recommendations, setRecommendations] = useState([]);
  const [seasonalAnime, setSeasonalAnime] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const seasonalPromise = fetch(`/api/getAnime?type=seasonal`).then(
          (res) => {
            if (!res.ok) throw new Error("Failed to fetch seasonal anime.");
            return res.json();
          }
        );

        const recommendationPromise = userId
          ? fetch(`/api/getRecommendation?userId=${userId}`).then((res) => {
              if (!res.ok) throw new Error("Failed to fetch recommendations.");
              return res.json();
            })
          : Promise.resolve([]);

        const [seasonalData, recommendationData] = await Promise.all([
          seasonalPromise,
          recommendationPromise,
        ]);

        setSeasonalAnime(seasonalData);
        setRecommendations(recommendationData);
      } catch (err: any) {
        setError(err.message || "Something went wrong.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  const renderAnimeList = (animeList: any[]) => {
    if (animeList.length === 0) {
      return <p className="text-center text-white">No anime available.</p>;
    }

    return (
      <div className="flex flex-wrap justify-center items-start p-4 gap-4 w-full">
        {animeList.map((anime) => (
          <AnimeCard key={anime.id} anime={anime} />
        ))}
      </div>
    );
  };

  return (
    <div className="bg-gray-900 text-white w-full">
      {/* Tabs */}
      <Tabs
        tabs={["Seasonal", "Recommendations"]}
        activeTab={activeTab}
        onTabClick={(tab) => setActiveTab(tab)}
      />

      {/* Content */}
      {loading ? (
        <p className="text-center text-white">Loading...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : activeTab === "Seasonal" ? (
        renderAnimeList(seasonalAnime)
      ) : (
        renderAnimeList(recommendations)
      )}
    </div>
  );
};

export default RecommendationSeasonalSection;
