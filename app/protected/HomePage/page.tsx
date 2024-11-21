import { SignOutButton } from "@clerk/nextjs";
import VerifyUser from "@/app/components/Auth/VerifyUser";
import AnimeCard from "@/app/components/Card";
import { AnimeCardProps } from "@/util/constants";
import Log from "@/app/components/Log"

async function fetchPopularAnime() {
  const res = await fetch("http://localhost:3000/api/popularAnime");
  if (!res.ok) {
    throw new Error("Failed to fetch popular anime");
  }
  return res.json();
}

export default async function HomePage() {
  const popularList = await fetchPopularAnime();
  // console.log(popularList);

  return (
    <div className="home-container">
      <div className="user-header">
        <VerifyUser />
        {/* <SignOutButton /> */}
      </div>
        {/* <Log data={popularList}/> */}
        <div className="home-wrapper">
          <div className= "anime-list-container flex flex-wrap justify-evenly gap-4 p-4">
      {popularList.map(
        
        (anime : AnimeCardProps) => {
        return <AnimeCard key={anime.id} anime={anime} />
        }
      
      )}
      </div>
    </div>
        {/* <SignOutButton /> */}
    </div>
  );
}
