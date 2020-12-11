-- Up

UPDATE "profiles"
SET "flags" = replace("flags", 'questioning', 'Questioning')
WHERE "flags" LIKE '%questioning%'

-- Down

UPDATE "profiles"
SET "flags" = replace("flags", 'Questioning', 'questioning')
WHERE "flags" LIKE '%Questioning%'
