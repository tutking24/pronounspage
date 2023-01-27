-- Up

ALTER TABLE profiles ADD COLUMN sensitive TEXT NOT NULL DEFAULT '[]';

-- Down
