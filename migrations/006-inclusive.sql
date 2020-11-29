-- Up

CREATE TABLE inclusive (
      id TEXT NOT NULL PRIMARY KEY,
      insteadOf TEXT NOT NULL,
      say TEXT NOT NULL,
      because TEXT NOT NULL,
      locale TEXT NOT NULL,
      approved INTEGER NOT NULL,
      base_id TEXT
);

-- Down

DROP TABLE inclusive;
