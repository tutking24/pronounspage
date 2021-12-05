-- Up

CREATE TABLE mastodon_oauth (
    instance TEXT NOT NULL PRIMARY KEY,
    client_id TEXT NOT NULL,
    client_secret TEXT NOT NULL
);

-- Down

DROP TABLE mastodon_oauth;
