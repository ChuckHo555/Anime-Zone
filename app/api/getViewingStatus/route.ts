import { NextResponse } from "next/server";
import db from "@/util/connection";
import mysql from "mysql2/promise";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");
  const animeId = searchParams.get("animeId");
  const animeIdsParam = searchParams.get("animeIds");

  // Validate query parameters
  if (!userId) {
    return NextResponse.json({ error: "Missing userId" }, { status: 400 });
  }
  if (!animeId && !animeIdsParam) {
    return NextResponse.json(
      { error: "Missing animeId or animeIds" },
      { status: 400 }
    );
  }

  try {
    if (animeId) {
      // Fetch status for a single anime ID
      const [rows] = (await db.query(
        `SELECT episodesWatched, totalEpisodes, status FROM viewing_status WHERE userId = ? AND animeId = ?`,
        [userId, animeId]
      )) as [mysql.RowDataPacket[], mysql.FieldPacket[]];

      if (rows.length === 0) {
        // Return default status if no record exists
        return NextResponse.json({
          animeId: parseInt(animeId, 10),
          episodesWatched: 0,
          totalEpisodes: 0,
          status: "Not Watched",
        });
      }

      return NextResponse.json(rows[0]); // Return the found record
    } else if (animeIdsParam) {
      // Fetch status for multiple anime IDs
      const animeIds = animeIdsParam.split(",").map((id) => parseInt(id, 10));

      if (!animeIds.length) {
        return NextResponse.json([]); // Return empty if no valid IDs
      }

      const placeholders = animeIds.map(() => "?").join(",");
      const [rows] = (await db.query(
        `SELECT animeId, episodesWatched, totalEpisodes, status 
         FROM viewing_status 
         WHERE userId = ? AND animeId IN (${placeholders})`,
        [userId, ...animeIds]
      )) as [mysql.RowDataPacket[], mysql.FieldPacket[]];

      // Map results to ensure all anime IDs are included
      const results = animeIds.map((id) => {
        const match = rows.find((row) => row.animeId === id);
        return (
          match || {
            animeId: id,
            episodesWatched: 0,
            totalEpisodes: 0,
            status: "Not Watched",
          }
        );
      });

      return NextResponse.json(results);
    }
  } catch (error) {
    console.error("Database error fetching viewing status:", error);
    return NextResponse.json(
      { error: "Failed to fetch viewing status" },
      { status: 500 }
    );
  }
}

// POST function: Update or add the viewing status
export async function POST(request: Request) {
  const { animeId, userId, episodesWatched, totalEpisodes } =
    await request.json();

  // Validate inputs
  if (
    !animeId ||
    !userId ||
    typeof episodesWatched === "undefined" ||
    typeof totalEpisodes === "undefined"
  ) {
    return NextResponse.json({ error: "Invalid parameters" }, { status: 400 });
  }

  try {
    // Determine the status based on episodesWatched and totalEpisodes
    let status = "Not Watched";
    if (episodesWatched > 0 && episodesWatched < totalEpisodes) {
      status = "In Progress";
    } else if (episodesWatched === totalEpisodes) {
      status = "Finished";
    }

    // Check if the anime already exists in the viewing_status table
    const [rows] = (await db.query(
      `SELECT * FROM viewing_status WHERE userId = ? AND animeId = ?`,
      [userId, animeId]
    )) as [mysql.RowDataPacket[], mysql.FieldPacket[]];

    if (rows.length > 0) {
      // Update existing entry
      await db.query(
        `UPDATE viewing_status SET episodesWatched = ?, totalEpisodes = ?, status = ? WHERE userId = ? AND animeId = ?`,
        [episodesWatched, totalEpisodes, status, userId, animeId]
      );
      return NextResponse.json({ message: "Viewing status updated", status });
    } else {
      // Insert a new entry
      await db.query(
        `INSERT INTO viewing_status (userId, animeId, episodesWatched, totalEpisodes, status) VALUES (?, ?, ?, ?, ?)`,
        [userId, animeId, episodesWatched, totalEpisodes, status]
      );
      return NextResponse.json({ message: "Viewing status added", status });
    }
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { error: "Failed to update viewing status" },
      { status: 500 }
    );
  }
}
