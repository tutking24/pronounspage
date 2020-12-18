-- Up

CREATE TABLE terms (
    id TEXT NOT NULL PRIMARY KEY,
    term TEXT NOT NULL,
    original TEXT NULL,
    definition TEXT NOT NULL,
    locale TEXT NOT NULL,
    approved INTEGER NOT NULL,
    base_id TEXT,
    author_id TEXT NULL REFERENCES users(id),
    deleted INTEGER NOT NULL DEFAULT 0
);

-- Down

DROP TABLE terms;
