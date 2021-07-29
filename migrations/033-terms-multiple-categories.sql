-- Up

UPDATE terms SET category = 'orientacja seksualna,orientacja romantyczna' WHERE category='określenie orientacji romantycznej i seksualnej';

-- Down

UPDATE terms SET category = 'określenie orientacji romantycznej i seksualnej' WHERE category='orientacja seksualna,orientacja romantyczna';
