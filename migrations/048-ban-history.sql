-- Up

CREATE TABLE bans (
    type TEXT NOT NULL,
    value TEXT NOT NULL,
    PRIMARY KEY (type, value)
);
INSERT INTO bans VALUES ('email', 'myriamnicoleacostarodriguez@gmail.com');
INSERT INTO bans VALUES ('email', 'beherit1015@gmail.com');

-- Down

