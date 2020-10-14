-- Up

CREATE TABLE users (
    id TEXT NOT NULL PRIMARY KEY,
    username TEXT NOT NULL,
    email TEXT NOT NULL,
    roles TEXT NOT NULL,
    avatarSource TEXT
);

CREATE TABLE authenticators (
    id TEXT NOT NULL PRIMARY KEY,
    userId TEXT,
    type TEXT NOT NULL,
    payload TEXT NOT NULL,
    validUntil INTEGER,
    FOREIGN KEY(userId) REFERENCES users(id)
);

-- Down

DROP TABLE authenticators;
DROP TABLE users;
