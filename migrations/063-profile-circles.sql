-- Up

CREATE TABLE user_connections (
    id TEXT NOT NULL PRIMARY KEY,
    from_profileId TEXT NOT NULL REFERENCES profiles ON DELETE CASCADE,
    to_userId TEXT NOT NULL REFERENCES users ON DELETE CASCADE,
    relationship TEXT NOT NULL
);

CREATE INDEX "user_connections_from_profileId" ON "user_connections" ("from_profileId");
CREATE INDEX "user_connections_to_userId" ON "user_connections" ("to_userId");

-- Down

