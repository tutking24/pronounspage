-- Up

CREATE TABLE subscriptions (
    id TEXT NOT NULL PRIMARY KEY,
    locale TEXT NOT NULL,
    type TEXT NOT NULL,
    email TEXT NOT NULL
);

CREATE INDEX "subscriptions_locale" ON "subscriptions" ("locale");
CREATE INDEX "subscriptions_type" ON "subscriptions" ("type");

-- Down

DROP TABLE subscriptions;
