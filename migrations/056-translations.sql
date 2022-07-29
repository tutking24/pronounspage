-- Up

CREATE TABLE translations (
    id TEXT NOT NULL PRIMARY KEY,
    locale TEXT NOT NULL,
    tKey TEXT NOT NULL,
    tValue TEXT NOT NULL,
    status INTEGER NOT NULL,
    author_id TEXT NULL REFERENCES users(id)
);

CREATE INDEX "translations_locale" ON "translations" ("locale");
CREATE INDEX "translations_key" ON "translations" ("key");
CREATE INDEX "translations_status" ON "translations" ("status");

-- Down

DROP TABLE translations;
