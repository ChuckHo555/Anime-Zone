import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const animeId = searchParams.get("id");
  const type = searchParams.get("type") || "general";
  const search = searchParams.get("search"); // New search parameter

  try {
    const query =
      search
        ? ` 
          query {
            Page(page: 1, perPage: 10) {
              media(search: "${search}", type: ANIME) {
                id
                title {
                  romaji
                  english
                }
                coverImage {
                  large
                }
                averageScore
                genres
              }
            }
          }
        `
        : animeId
        ? ` 
          query {
            Media(id: ${animeId}) {
              id
              title {
                romaji
                english
                native
              }
              description
              genres
              averageScore
              coverImage {
                large
              }
              episodes
              season
              seasonYear
            }
          }
        `
        : type === "popular"
        ? ` 
          query {
            Page(page: 1, perPage: 10) {
              media(sort: POPULARITY_DESC, type: ANIME) {
                id
                title {
                  romaji
                  english
                }
                coverImage {
                  large
                }
                averageScore
                genres
              }
            }
          }
        `
        : ` 
          query {
            Page(page: 1, perPage: 20) {
              media(type: ANIME) {
                id
                title {
                  romaji
                  english
                }
                coverImage {
                  large
                }
                averageScore
                genres
              }
            }
          }
        `;

    const url = "https://graphql.anilist.co";
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ query }),
    };

    const response = await fetch(url, options);
    const data = await response.json();

    if (data.errors) {
      return NextResponse.json({ error: "Error fetching data from AniList API" }, { status: 500 });
    }

    if (search) {
      return NextResponse.json(data.data.Page.media); // Return search results
    } else if (animeId) {
      return NextResponse.json(data.data.Media); // Return detailed anime
    } else if (type === "popular") {
      return NextResponse.json(data.data.Page.media); // Return popular anime
    } else {
      return NextResponse.json(data.data.Page.media); // Default general anime
    }
  } catch (error) {
    console.error("Error fetching anime:", error);
    return NextResponse.json({ error: "Failed to fetch anime" }, { status: 500 });
  }
}
