-- Up

ALTER TABLE profiles ADD COLUMN cardDark TEXT NULL;

UPDATE profiles SET cardDark = replace(card, '.png', '-dark.png') WHERE card IS NOT NULL;

-- Down
