-- Up

CREATE TABLE usernames (
   id TEXT NOT NULL PRIMARY KEY,
   userId TEXT NOT NULL,
   username TEXT NOT NULL,
   usernameNorm TEXT NOT NULL,
   avatarSource TEXT,

   FOREIGN KEY(userId) REFERENCES users(id)
);

CREATE UNIQUE INDEX "usernames_username" ON "usernames" ("username");
CREATE UNIQUE INDEX "usernames_usernameNorm" ON "usernames" ("usernameNorm");

INSERT INTO usernames (id, userId, username, usernameNorm, avatarSource)
SELECT u.id, u.id, u.username, u.usernameNorm, u.avatarSource
FROM users u;

PRAGMA foreign_keys=off;

ALTER TABLE profiles RENAME TO _profiles_old;
CREATE TABLE profiles (
    id TEXT NOT NULL PRIMARY KEY,
    usernameId TEXT NOT NULL,
    locale TEXT NOT NULL,
    names TEXT NOT NULL,
    pronouns TEXT NOT NULL,
    description TEXT NOT NULL,
    birthday TEXT,
    links TEXT NOT NULL,
    flags TEXT NOT NULL,
    words TEXT NOT NULL,
    active INTEGER NOT NULL,
    teamName TEXT NULL DEFAULT NULL,
    footerName TEXT NULL DEFAULT NULL,
    footerAreas TEXT NULL DEFAULT NULL,
    customFlags TEXT NOT NULL DEFAULT '{}',
    card TEXT NULL,
    FOREIGN KEY(usernameId) REFERENCES usernames(id),
    UNIQUE ("usernameId", "locale")
);
INSERT INTO profiles SELECT * FROM _profiles_old;
DROP TABLE _profiles_old;

ALTER TABLE users RENAME TO _users_old;
CREATE TABLE users (
    id TEXT NOT NULL PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    roles TEXT NOT NULL,
    bannedReason TEXT NULL
);
INSERT INTO users SELECT id, email, roles, bannedReason FROM _users_old;
DROP TABLE _users_old;

ALTER TABLE reports RENAME TO _reports_old;
CREATE TABLE reports (
    id TEXT NOT NULL PRIMARY KEY,
    profileId TEXT NOT NULL,
    reporterId TEXT NULL,
    comment TEXT NOT NULL,
    isAutomatic INTEGER,
    isHandled INTEGER,

    FOREIGN KEY(profileId) REFERENCES profiles(id),
    FOREIGN KEY(reporterId) REFERENCES users(id)
);
INSERT INTO reports SELECT id, userId, reporterId, comment, isAutomatic, isHandled FROM _reports_old;
DROP TABLE _reports_old;

PRAGMA foreign_keys=on;

-- Down

DROP TABLE usernames;
