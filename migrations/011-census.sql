-- Up

CREATE TABLE census (
    id TEXT NOT NULL PRIMARY KEY,
    locale TEXT NOT NULL,
    edition TEXT NOT NULL,
    userId TEXT NULL,
    fingerprint TEXT NULL,
    answers TEXT NOT NULL,
    writins TEXT NOT NULL
);

-- Down

DROP TABLE census;
