-- Up

CREATE TABLE emails (
    email TEXT NOT NULL,
    sentAt INTEGER NOT NULL
);

-- Down

DROP TABLE emails;
