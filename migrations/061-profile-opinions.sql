-- Up

ALTER TABLE profiles ADD COLUMN opinions TEXT NOT NULL DEFAULT '{}';

-- Down

