-- Up

UPDATE users SET avatarSource = 'gravatar' WHERE avatarSource IS NULL;

-- Down

UPDATE users SET avatarSource = NULL WHERE avatarSource = 'gravatar';
