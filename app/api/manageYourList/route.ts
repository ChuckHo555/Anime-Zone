import { NextResponse } from "next/server";
import db from "@/util/connection";
import mysql from "mysql2/promise"; // Import types for proper typing

export async function POST(request: Request) {
  const { animeId, userId, listType } = await request.json();

  // Validate inputs
  if (!animeId || !userId || !listType) {
    return NextResponse.json({ error: "Invalid parameters" }, { status: 400 });
  }

  const validListTypes = ["favorites", "watchLater"];
  if (!validListTypes.includes(listType)) {
    return NextResponse.json({ error: "Invalid list type" }, { status: 400 });
  }

  try {
    const tableName = listType === "favorites" ? "favorites" : "watchLater";

    // Type rows to be an array of any objects
    const [rows] = (await db.query(
      `SELECT * FROM ${tableName} WHERE userId = ? AND animeId = ?`,
      [userId, animeId]
    )) as [mysql.RowDataPacket[], mysql.FieldPacket[]];

    // Check if the anime already exists in the list
    if (rows.length > 0) {
      // Remove from the list
      await db.query(
        `DELETE FROM ${tableName} WHERE userId = ? AND animeId = ?`,
        [userId, animeId]
      );
      return NextResponse.json({ message: `${listType} removed` });
    } else {
      // Add to the list
      await db.query(
        `INSERT INTO ${tableName} (userId, animeId) VALUES (?, ?)`,
        [userId, animeId]
      );
      return NextResponse.json({ message: `${listType} added` });
    }
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { error: "Failed to update list"},
      { status: 500 }
    );
  }
}
