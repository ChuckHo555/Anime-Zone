"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import Tabs from "@/app/components/Tab";
import NoteCard from "@/app/components/NoteCard";
import { AnimeCardData } from "@/util/constants";

const tabs = ["Watch Later", "Favorites", "In Progress", "Finished"];

export default function YourListComponent() {
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState<string>(tabs[0]);
  const [animeList, setAnimeList] = useState<AnimeCardData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnimeList = async () => {
    if (!user?.id) return;

    setLoading(true);
    setError(null);

    try {
      const listRes = await fetch(
        `/api/getYourList?userId=${user.id}&tab=${encodeURIComponent(activeTab)}`
      );
      if (!listRes.ok) {
        throw new Error("Failed to fetch anime list");
      }

      const animeData: {
        animeId: string;
        genres: string;
        status: string;
      }[] = await listRes.json();
      console.log("Fetched Anime Data:", animeData);

      if (!animeData.length) {
        setAnimeList([]);
        setLoading(false);
        return;
      }

      const animeIds = animeData.map((item) => item.animeId);
      const aniListData = await fetchAniListData(animeIds);

      console.log("AniList Data:", aniListData);

      const notesRes = await fetch(`/api/getNotes?userId=${user.id}`);
      if (!notesRes.ok) {
        throw new Error("Failed to fetch user notes");
      }
      const userNotes: { animeId: string; note: string }[] = await notesRes.json();

      console.log("User Notes:", userNotes);

      const mergedData: AnimeCardData[] = aniListData.map(
        (anime: {
          id: string; // Treat as string
          coverImage: { large: string };
          title: { romaji: string; english?: string };
          genres: string[];
          averageScore: number;
        }): AnimeCardData => {
          const note = userNotes.find((n) => n.animeId === anime.id)?.note || "";
      
          // Ensure animeId comparison as string
          const statusData = animeData.find((item) => item.animeId === String(anime.id));
          console.log("Both the Ids :", animeData)
          console.log("ANime Ids:", anime.id)

          if (!statusData) {
            console.error(`No matching status for anime ID ${anime.id}`);
          } else {
            console.log(`Mapped status for anime ID ${anime.id}: ${statusData.status}`);
          }
          
      
          return {
            id: anime.id,
            image: anime.coverImage.large,
            title: anime.title.english || anime.title.romaji,
            genres: anime.genres,
            userReview: note,
            userScore: 0,
            animeScore: anime.averageScore,
            status: statusData?.status || "Not Watched", // Fallback to "Not Watched"
          };
        }
      );
      

      console.log("Merged Data:", mergedData);

      setAnimeList(mergedData);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An error occurred while fetching anime data");
    } finally {
      setLoading(false);
    }
  };

  const fetchAniListData = async (animeIds: string[]) => {
    const query = `
      query ($ids: [Int]) {
        Page(page: 1, perPage: ${animeIds.length}) {
          media(id_in: $ids) {
            id
            title {
              romaji
              english
            }
            coverImage {
              large
            }
            genres
            averageScore
          }
        }
      }
    `;

    const response = await fetch("https://graphql.anilist.co", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, variables: { ids: animeIds.map(Number) } }), // Convert string IDs to numbers for the query
    });

    if (!response.ok) {
      throw new Error("Failed to fetch data from AniList");
    }

    const data = await response.json();
    return data.data.Page.media;
  };

  useEffect(() => {
    fetchAnimeList();
  }, [activeTab]);

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="w-full">
        <Tabs tabs={tabs} activeTab={activeTab} onTabClick={setActiveTab} />
      </div>

      {loading && <p className="text-gray-400 text-center">Loading...</p>}
      {error && <p className="text-red-500 text-center">{error}</p>}

      {!loading && animeList.length === 0 && !error && (
        <p className="text-gray-400 text-center">No anime found in this list.</p>
      )}

      <div className="flex flex-wrap justify-center gap-6">
        {animeList.map((anime) => {
          console.log("Anime being passed to NoteCard:", anime); // Log each anime object
          return (
            <NoteCard
              key={anime.id}
              anime={anime}
              onReviewUpdate={(review: string) =>
                console.log(`Update review for ${anime.id}: ${review}`)
              }
              onScoreUpdate={(score: number) =>
                console.log(`Update score for ${anime.id}: ${score}`)
              }
            />
          );
        })}
      </div>
    </div>
  );
}
