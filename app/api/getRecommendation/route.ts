import { NextResponse } from "next/server";
import db from "@/util/connection";
import mysql from "mysql2/promise";

interface GenreRow extends mysql.RowDataPacket {
  genres: string | null; // Ensure the type accounts for null values
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }

  try {
    // Fetch user's saved genres from favorites and watchLater
    const [rows] = (await db.query(
      `
      SELECT DISTINCT genres
      FROM (
        SELECT genres
        FROM favorites
        WHERE userId = ?
        UNION
        SELECT genres
        FROM watchLater
        WHERE userId = ?
      ) as userGenres
    `,
      [userId, userId]
    )) as [GenreRow[], mysql.FieldPacket[]];

    // If no genres found, return 404
    if (rows.length === 0) {
      return NextResponse.json(
        { message: "No genres found for recommendations" },
        { status: 404 }
      );
    }

    // Extract genres from rows, ensure filtering null or empty genres
    const genres = rows
      .flatMap((row) => (row.genres ? row.genres.split(",") : []))
      .map((genre) => genre.trim())
      .filter(Boolean); // Remove empty or invalid entries

    if (genres.length === 0) {
      return NextResponse.json(
        { message: "No valid genres available for recommendations" },
        { status: 404 }
      );
    }

    // Prepare query for AniList API to fetch recommendations based on genres
    const query = `
      query {
        Page(page: 1, perPage: 10) {
          media(genre_in: [${genres.map((genre) => `"${genre}"`).join(", ")}], type: ANIME) {
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
      return NextResponse.json(
        { error: "Error fetching recommendations from AniList API" },
        { status: 500 }
      );
    }

    const recommendations = data.data.Page.media.map((anime: any) => ({
      id: anime.id,
      title: anime.title,
      coverImage: anime.coverImage,
      averageScore: anime.averageScore,
      genres: anime.genres,
    }));

    return NextResponse.json(recommendations); // Return formatted recommendations
  } catch (error) {
    console.error("Error fetching recommendations:", error);
    return NextResponse.json(
      { error: "Failed to fetch recommendations" },
      { status: 500 }
    );
  }
}
