import { NextResponse } from "next/server";
import db from "@/util/connection";
import mysql from "mysql2/promise";

export async function POST(request: Request) {
  const { animeId, userId, listType, genres } = await request.json();

  // Validate inputs
  if (!animeId || !userId || !listType || !genres || !Array.isArray(genres)) {
    return NextResponse.json({ error: "Invalid parameters" }, { status: 400 });
  }

  const validListTypes = ["favorites", "watchLater"];
  if (!validListTypes.includes(listType)) {
    return NextResponse.json({ error: "Invalid list type" }, { status: 400 });
  }

  try {
    const tableName = listType === "favorites" ? "favorites" : "watchLater";

    // Check if the anime already exists in the list
    const [rows] = (await db.query(
      `SELECT * FROM ${tableName} WHERE userId = ? AND animeId = ?`,
      [userId, animeId]
    )) as [mysql.RowDataPacket[], mysql.FieldPacket[]];

    if (rows.length > 0) {
      // Remove from the list
      await db.query(
        `DELETE FROM ${tableName} WHERE userId = ? AND animeId = ?`,
        [userId, animeId]
      );
      return NextResponse.json({ message: `${listType} removed` });
    } else {
      // Add to the list, include genres
      await db.query(
        `INSERT INTO ${tableName} (userId, animeId, genres) VALUES (?, ?, ?)`,
        [userId, animeId, genres.join(",")]
      );
      return NextResponse.json({ message: `${listType} added` });
    }
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { error: "Failed to update list" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");
  const animeId = searchParams.get("animeId");

  if (!userId || !animeId) {
    return NextResponse.json({ error: "Missing userId or animeId" }, { status: 400 });
  }

  try {
    const [favoritesRows] = (await db.query(
      `SELECT * FROM favorites WHERE userId = ? AND animeId = ?`,
      [userId, animeId]
    )) as [mysql.RowDataPacket[], mysql.FieldPacket[]];

    const [watchLaterRows] = (await db.query(
      `SELECT * FROM watchLater WHERE userId = ? AND animeId = ?`,
      [userId, animeId]
    )) as [mysql.RowDataPacket[], mysql.FieldPacket[]];

    return NextResponse.json({
      isInFavorites: favoritesRows.length > 0,
      isInWatchList: watchLaterRows.length > 0,
    });
  } catch (error) {
    console.error("Database error checking list status:", error);
    return NextResponse.json(
      { error: "Failed to check list status" },
      { status: 500 }
    );
  }
}
