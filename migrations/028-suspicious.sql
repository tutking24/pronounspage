-- Up

ALTER TABLE users ADD COLUMN suspiciousChecked TINYINT NOT NULL DEFAULT 0;

-- Down
