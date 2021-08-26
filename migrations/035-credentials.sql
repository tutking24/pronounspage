-- Up

ALTER TABLE profiles ADD COLUMN credentials TEXT NULL DEFAULT NULL;
ALTER TABLE profiles ADD COLUMN credentialsLevel INTEGER NULL DEFAULT NULL;
ALTER TABLE profiles ADD COLUMN credentialsName INTEGER NULL DEFAULT NULL;

UPDATE profiles
SET credentials = 'magistra filologii angielskiej',
    credentialsLevel = 5,
    credentialsName = 'Karolina Grenda'
WHERE locale = 'pl' AND userId = (SELECT id FROM users WHERE usernameNorm = 'kafka');

UPDATE profiles
SET credentials = 'magister filologii angielskiej|student filologii hiszpańskiej',
    credentialsLevel = 5
WHERE locale = 'pl' AND userId = (SELECT id FROM users WHERE usernameNorm = 'ausir');

UPDATE profiles
SET credentials = 'magistra filologii słowiańskiej (z językiem czeskim) i filologii polskiej na UAM|{http://gazetylokalne.pl/sgl-local-press-2018-nominacje/=dziennikarka nominowana do SGL Local Press 2018 za reportaż „Film »Kler« i kler wrzesiński”}',
    credentialsLevel = 5,
    credentialsName = 'Anna Tess Gołębiowska'
WHERE locale = 'pl' AND userId = (SELECT id FROM users WHERE usernameNorm = 'tess');

UPDATE profiles
SET credentials = 'magistru językoznawstwa',
    credentialsLevel = 5
WHERE locale = 'pl' AND userId = (SELECT id FROM users WHERE usernameNorm = 'cake');

UPDATE profiles
SET credentials = 'magister językoznawstwa|absolwent Gender Studies w PAN|doktorant w Instytucie Anglistyki UW|https://orcid.org/0000-0002-0214-0387',
    credentialsLevel = 6
WHERE locale = 'pl' AND userId = (SELECT id FROM users WHERE usernameNorm = 'szymon');

UPDATE profiles
SET credentials = 'inżynierze Informatyki|finaliszcze Olimpiady Literatury i Języka Polskiego',
    credentialsLevel = 1
WHERE locale = 'pl' AND userId = (SELECT id FROM users WHERE usernameNorm = 'andrea');

-- Down

