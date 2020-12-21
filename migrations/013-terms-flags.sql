-- Up

ALTER TABLE terms ADD COLUMN flags TEXT NOT NULL DEFAULT '[]';

-- Down

