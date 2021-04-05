-- Up

ALTER TABLE profiles ADD COLUMN customFlags TEXT NOT NULL DEFAULT '{}';

-- Down
