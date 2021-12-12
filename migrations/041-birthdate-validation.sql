-- Up

UPDATE profiles SET birthday = null WHERE birthday > '2008-12-13' OR birthday < '1900-01-01';

-- Down

