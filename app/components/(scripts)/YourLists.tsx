"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import Tabs from "@/app/components/(utility)/Tab";
import NoteCard from "@/app/components/(utility)/NoteCard";
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
        `/api/getYourList?userId=${user.id}&tab=${encodeURIComponent(
          activeTab
        )}`
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

      const userNotes = await fetchNotesForAllAnime(animeIds);

      console.log("User Notes:", userNotes);

      const mergedData: AnimeCardData[] = aniListData.map(
        (anime: {
          id: string;
          coverImage: { large: string };
          title: { romaji: string; english?: string };
          genres: string[];
          averageScore: number;
        }): AnimeCardData => {
          const noteData = userNotes.find((n) => n.animeId === anime.id) || {
            note: "",
            userRating: 0,
          };

          const statusData = animeData.find(
            (item) => item.animeId === String(anime.id)
          );

          return {
            id: anime.id,
            image: anime.coverImage.large,
            title: anime.title.english || anime.title.romaji,
            genres: anime.genres,
            userReview: noteData.note,
            userScore: noteData.userRating,
            animeScore: anime.averageScore,
            status: statusData?.status || "Not Watched",
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

  const fetchNotesForAllAnime = async (animeIds: string[]) => {
    try {
      const notesRes = await fetch(`/api/getNotes?userId=${user?.id}`);
      if (!notesRes.ok) {
        throw new Error("Failed to fetch user notes");
      }

      const notesData: { animeId: string; note: string; userRating: number }[] =
        await notesRes.json();

      return notesData.filter((note) => animeIds.includes(note.animeId));
    } catch (error) {
      console.error("Error fetching notes:", error);
      return [];
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
      body: JSON.stringify({ query, variables: { ids: animeIds.map(Number) } }),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch data from AniList");
    }

    const data = await response.json();
    return data.data.Page.media;
  };

  const handleReviewUpdate = async (animeId: string, review: string) => {
    const payload = { userId: user?.id, animeId, note: review };
    console.log("Payload for review update:", payload);

    try {
      const res = await fetch(`/api/getNotes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error(`Failed to update review for anime ID ${animeId}`);
      }

      console.log(`Review updated successfully for anime ID ${animeId}`);
    } catch (error) {
      console.error(error);
    }
  };

  const handleScoreUpdate = async (animeId: string, score: number) => {
    const payload = { userId: user?.id, animeId, userRating: score };
    console.log("Payload for score update:", payload);

    try {
      const res = await fetch(`/api/getNotes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error(`Failed to update score for anime ID ${animeId}`);
      }

      console.log(`Score updated successfully for anime ID ${animeId}`);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchAnimeList();
  }, [activeTab]);

  return (
    <div className="flex flex-col gap-4 p-4 w-full">
      <div className="w-full">
        <Tabs tabs={tabs} activeTab={activeTab} onTabClick={setActiveTab} />
      </div>

      {loading && <p className="text-gray-400 text-center">Loading...</p>}
      {error && <p className="text-red-500 text-center">{error}</p>}

      {!loading && animeList.length === 0 && !error && (
        <p className="text-gray-400 text-center">
          No anime found in this list.
        </p>
      )}

      <div className="flex flex-col gap-4 w-full">
        {animeList.map((anime) => (
          <NoteCard
            key={anime.id}
            anime={anime}
            onReviewUpdate={(review: string) =>
              handleReviewUpdate(anime.id, review)
            }
            onScoreUpdate={(score: number) =>
              handleScoreUpdate(anime.id, score)
            }
          />
        ))}
      </div>
    </div>
  );
}
