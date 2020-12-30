-- Up

UPDATE users SET roles = '*' WHERE roles = 'admin';
UPDATE users SET roles = '' WHERE roles = 'user';

-- Down

UPDATE users SET roles = 'admin' WHERE roles = '*';
UPDATE users SET roles = 'user' WHERE roles = '';
