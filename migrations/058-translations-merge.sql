-- Up

UPDATE translations SET status = 2 WHERE status = 1;

-- Down

UPDATE translations SET status = 1 WHERE status = 2;
