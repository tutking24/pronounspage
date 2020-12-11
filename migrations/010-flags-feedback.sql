-- Up

UPDATE "profiles"
SET "flags" = replace("flags", ',"Lipstick Lesbian"', '')
WHERE "flags" LIKE '%questioning%'

-- Down

