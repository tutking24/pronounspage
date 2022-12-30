-- Up

CREATE TABLE stats (
   id TEXT NOT NULL,
   locale TEXT NOT NULL,
   users INTEGER NOT NULL,
   data TEXT NOT NULL,
   PRIMARY KEY (id, locale)
);

-- Down

