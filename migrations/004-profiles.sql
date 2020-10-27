-- Up

CREATE TABLE profiles (
    id TEXT NOT NULL PRIMARY KEY,
    userId TEXT NOT NULL,
    locale TEXT NOT NULL,
    names TEXT NOT NULL,
    pronouns TEXT NOT NULL,
    description TEXT NOT NULL,
    birthday TEXT,
    links TEXT NOT NULL,
    flags TEXT NOT NULL,
    words TEXT NOT NULL,
    active INTEGER NOT NULL,
    FOREIGN KEY(userId) REFERENCES users(id),
    UNIQUE ("userId", "locale")
);

-- Down

DROP TABLE "profiles";
