-- Up

ALTER TABLE terms ADD COLUMN category TEXT NULL DEFAULT NULL;
ALTER TABLE terms ADD COLUMN images TEXT NOT NULL DEFAULT '';

-- Down
