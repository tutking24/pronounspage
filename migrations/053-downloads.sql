-- Up

CREATE TABLE downloads (
    id TEXT NOT NULL PRIMARY KEY,
    locale TEXT NOT NULL,
    filename TEXT NOT NULL
);

CREATE INDEX "downloads_filename" ON "downloads" ("locale", "filename");

-- Down

DROP TABLE downloads;
