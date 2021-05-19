-- Up

UPDATE inclusive
SET links = REPLACE(links, '"]', '","https://www.interakcja.org.pl/slownictwo/"]')
WHERE categories LIKE '%interpłciowość%';

UPDATE inclusive
SET links = REPLACE(links, '[]', '["https://www.interakcja.org.pl/slownictwo/"]')
WHERE categories LIKE '%interpłciowość%';

-- Down
