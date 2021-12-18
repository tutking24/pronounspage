-- Up

ALTER TABLE users ADD COLUMN banSnapshot TEXT NULL;
ALTER TABLE reports ADD COLUMN snapshot TEXT NULL;

-- Down

