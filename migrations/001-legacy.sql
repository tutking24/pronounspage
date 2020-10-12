-- Up

CREATE TABLE nouns (
    id TEXT NOT NULL PRIMARY KEY,
    masc TEXT NOT NULL,
    fem TEXT NOT NULL,
    neutr TEXT NOT NULL,
    mascPl TEXT NOT NULL,
    femPl TEXT NOT NULL,
    neutrPl TEXT NOT NULL,
    approved INTEGER NOT NULL,
    base_id TEXT
);

INSERT INTO nouns VALUES ('01EEKD4RYFWXG63Y563HF0RP56', 'pan', 'pani', 'panu|państwo', 'panowie', 'panie', 'państwo', 1, null);

-- Down

DROP TABLE nouns;
