import { useState, useEffect } from "react";
import { AnimeCardProps } from "@/util/constants";

const PopularAnimeFetcher = ({ setPopularList }: { setPopularList: (data: AnimeCardProps["anime"][]) => void }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPopularAnime() {
      try {
        const res = await fetch("/api/getAnime?type=popular");
        if (!res.ok) {
          throw new Error("Failed to fetch popular anime");
        }
        const data = await res.json();
        setPopularList(data);
      } catch (err) {
        setError("Failed to load popular anime");
      } finally {
        setLoading(false);
      }
    }

    fetchPopularAnime();
  }, [setPopularList]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return null;
};

export default PopularAnimeFetcher;
