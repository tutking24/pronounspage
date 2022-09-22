-- Up

CREATE TABLE ban_proposals (
    id TEXT NOT NULL PRIMARY KEY,
    userId TEXT NULL NOT NULL REFERENCES users ON DELETE CASCADE,
    bannedBy TEXT NOT NULL REFERENCES users ON DELETE SET NULL,
    bannedTerms TEXT NULL NOT NULL,
    bannedReason TEXT NOT NULL
);

CREATE INDEX "ban_proposals_userId" ON "ban_proposals" ("userId");

-- Down

