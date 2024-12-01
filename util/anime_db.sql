CREATE DATABASE IF NOT EXISTS anime_db;
USE anime_db;

CREATE TABLE users (
    userId VARCHAR(255) NOT NULL,
    username VARCHAR(255),
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (userId)
);

CREATE TABLE watchlater (
    userId VARCHAR(255) NOT NULL,
    animeId VARCHAR(255) NOT NULL,
    genres TEXT,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (userId, animeId),
    CONSTRAINT fk_watchlater_user FOREIGN KEY (userId) REFERENCES users(userId) ON DELETE CASCADE
);

CREATE TABLE favorites (
    userId VARCHAR(255) NOT NULL,
    animeId VARCHAR(255) NOT NULL,
    genres TEXT,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (userId, animeId),
    CONSTRAINT fk_favorites_user FOREIGN KEY (userId) REFERENCES users(userId) ON DELETE CASCADE
);

CREATE TABLE viewing_status (
    userId VARCHAR(255) NOT NULL,
    animeId VARCHAR(255) NOT NULL,
    status ENUM('Watched', 'Not Watched', 'In Progress') NOT NULL DEFAULT 'Not Watched',
    PRIMARY KEY (userId, animeId),
    CONSTRAINT fk_viewing_status_user FOREIGN KEY (userId) REFERENCES users(userId) ON DELETE CASCADE
);

CREATE TABLE user_notes (
    userId VARCHAR(255) NOT NULL,
    animeId VARCHAR(255) NOT NULL,
    note TEXT,
    userRating INT DEFAULT 0,
    PRIMARY KEY (userId, animeId),
    CONSTRAINT fk_user_notes_user FOREIGN KEY (userId) REFERENCES users(userId) ON DELETE CASCADE
);
