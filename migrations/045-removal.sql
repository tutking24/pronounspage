-- Up

PRAGMA foreign_keys=off;

ALTER TABLE users RENAME TO _users_old;
create table users (
    id                TEXT not null
        primary key,
    username          TEXT not null,
    email             TEXT not null,
    roles             TEXT not null,
    avatarSource      TEXT,
    bannedReason      TEXT,
    suspiciousChecked TINYINT default 0 not null,
    usernameNorm      TEXT,
    bannedTerms       TEXT    default NULL,
    bannedBy          TEXT    default NULL,
    lastActive        INTEGER,
    banSnapshot       TEXT
);
INSERT INTO users SELECT * FROM _users_old;
DROP TABLE _users_old;

ALTER TABLE authenticators RENAME TO _authenticators_old;
create table authenticators (
    id          TEXT not null primary key,
    userId      TEXT
        references users on delete cascade,
    type        TEXT not null,
    payload     TEXT not null,
    validUntil  INTEGER
);
INSERT INTO authenticators SELECT * FROM _authenticators_old;
DROP TABLE _authenticators_old;

ALTER TABLE inclusive RENAME TO _inclusive_old;
create table inclusive
(
    id         TEXT    not null
        primary key,
    insteadOf  TEXT    not null,
    say        TEXT    not null,
    because    TEXT    not null,
    locale     TEXT    not null,
    approved   INTEGER not null,
    base_id    TEXT,
    author_id  TEXT
        references users on delete set null,
    categories TEXT,
    links      TEXT,
    deleted    INTEGER default 0 not null
);
INSERT INTO inclusive SELECT * FROM _inclusive_old;
DROP TABLE _inclusive_old;

ALTER TABLE names RENAME TO _names_old;
create table names
(
    id              TEXT not null
        primary key,
    name            TEXT not null,
    locale          TEXT not null,
    origin          TEXT,
    meaning         TEXT,
    usage           TEXT,
    legally         TEXT,
    pros            TEXT,
    cons            TEXT,
    notablePeople   TEXT,
    links           TEXT,
    namedays        TEXT,
    namedaysComment TEXT,
    deleted         INTEGER default 0 not null,
    approved        INTEGER default 0 not null,
    base_id         TEXT,
    author_id       TEXT
);
INSERT INTO names SELECT * FROM _names_old;
DROP TABLE _names_old;

ALTER TABLE nouns RENAME TO _nouns_old;
create table nouns
(
    id        TEXT    not null
        primary key,
    masc      TEXT    not null,
    fem       TEXT    not null,
    neutr     TEXT    not null,
    mascPl    TEXT    not null,
    femPl     TEXT    not null,
    neutrPl   TEXT    not null,
    approved  INTEGER not null,
    base_id   TEXT,
    locale    TEXT    default 'pl' not null,
    author_id TEXT
        references users on delete set null,
    deleted   INTEGER default 0 not null,
    sources   TEXT    default NULL
);
INSERT INTO nouns SELECT * FROM _nouns_old;
DROP TABLE _nouns_old;

ALTER TABLE profiles RENAME TO _profiles_old;
create table profiles
(
    id               TEXT    not null
        primary key,
    userId           TEXT    not null
        references users on delete cascade,
    locale           TEXT    not null,
    names            TEXT    not null,
    pronouns         TEXT    not null,
    description      TEXT    not null,
    birthday         TEXT,
    links            TEXT    not null,
    flags            TEXT    not null,
    words            TEXT    not null,
    active           INTEGER not null,
    teamName         TEXT    default NULL,
    footerName       TEXT    default NULL,
    footerAreas      TEXT    default NULL,
    customFlags      TEXT    default '{}' not null,
    card             TEXT,
    credentials      TEXT    default NULL,
    credentialsLevel INTEGER default NULL,
    credentialsName  INTEGER default NULL,
    cardDark         TEXT,
    unique (userId, locale)
);
INSERT INTO profiles SELECT * FROM _profiles_old;
DROP TABLE _profiles_old;

ALTER TABLE reports RENAME TO _reports_old;
create table reports
(
    id          TEXT not null
        primary key,
    userId      TEXT
        references users on delete cascade ,
    reporterId  TEXT
        references users on delete set null,
    comment     TEXT not null,
    isAutomatic INTEGER,
    isHandled   INTEGER,
    snapshot    TEXT
);
INSERT INTO reports SELECT * FROM _reports_old;
DROP TABLE _reports_old;

ALTER TABLE sources RENAME TO _sources_old;
create table sources
(
    id           TEXT not null
        primary key,
    locale       TEXT not null,
    pronouns     TEXT not null,
    type         TEXT not null,
    author       TEXT,
    title        TEXT not null,
    extra        TEXT,
    year         INTEGER,
    fragments    TEXT not null,
    comment      TEXT,
    link         TEXT,
    submitter_id TEXT
        references users on delete set null,
    approved     INTEGER default 0,
    deleted      INTEGER default 0,
    base_id      TEXT,
    key          TEXT    default NULL,
    images       TEXT    default NULL
);
INSERT INTO sources SELECT * FROM _sources_old;
DROP TABLE _sources_old;

ALTER TABLE terms RENAME TO _terms_old;
create table terms
(
    id         TEXT    not null
        primary key,
    term       TEXT    not null,
    original   TEXT,
    definition TEXT    not null,
    locale     TEXT    not null,
    approved   INTEGER not null,
    base_id    TEXT,
    author_id  TEXT
        references users on delete set null,
    deleted    INTEGER default 0 not null,
    flags      TEXT    default '[]' not null,
    category   TEXT    default NULL,
    images     TEXT    default '' not null,
    key        TEXT
);
INSERT INTO terms SELECT * FROM _terms_old;
DROP TABLE _terms_old;

PRAGMA foreign_keys=on;

-- Down

