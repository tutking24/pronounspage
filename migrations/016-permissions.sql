-- Up

UPDATE users SET roles = '' WHERE roles = 'user';

-- Down

UPDATE users SET roles = 'user' WHERE roles = '';
