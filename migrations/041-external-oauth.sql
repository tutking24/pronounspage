-- Up

CREATE TABLE oauth_keys (
    instance TEXT NOT NULL PRIMARY KEY,
    provider TEXT NOT NULL,
    client_id TEXT NOT NULL,
    client_secret TEXT NOT NULL
);

-- Down

DROP TABLE oauth_keys;
