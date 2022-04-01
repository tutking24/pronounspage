-- Up

UPDATE users SET avatarSource = REPLACE(avatarSource, 'https://pronouns-page.s3-eu-west-1.amazonaws.com/images/', 'https://dclu0bpcdglik.cloudfront.net/images/')
    WHERE avatarSource LIKE 'https://%/images/%';

-- Down

