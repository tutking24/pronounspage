-- Up

CREATE TABLE user_messages (
    id TEXT NOT NULL PRIMARY KEY,
    userId TEXT NOT NULL,
    adminId TEXT NOT NULL,
    message TEXT NOT NULL
);

-- Down

