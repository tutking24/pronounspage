-- Up

ALTER TABLE users ADD COLUMN usernameNorm TEXT NULL; -- shouldn't be null, but we first need to populate it from JS
CREATE UNIQUE INDEX "users_usernameNorm" ON "users" ("usernameNorm");

CREATE INDEX "authenticators_type" ON "authenticators" ("type");
CREATE INDEX "authenticators_userId" ON "authenticators" ("userId");

CREATE INDEX "census_locale_edition" ON "census" ("locale", "edition");
CREATE INDEX "census_fingerprint" ON "census" ("fingerprint");

CREATE INDEX "emails_email" ON "emails" ("email");

CREATE INDEX "nouns_locale" ON "nouns" ("locale");
CREATE INDEX "nouns_masc" ON "nouns" ("masc");

CREATE INDEX "inclusive_locale" ON "inclusive" ("locale");
CREATE INDEX "inclusive_insteadOf" ON "inclusive" ("insteadOf");

CREATE INDEX "terms_locale" ON "terms" ("locale");
CREATE INDEX "terms_term" ON "terms" ("term");

CREATE INDEX "profiles_locale" ON "profiles" ("locale");
CREATE INDEX "profiles_userId" ON "profiles" ("userId");
CREATE INDEX "profiles_locale_userId" ON "profiles" ("locale", "userId");

CREATE INDEX "sources_locale" ON "sources" ("locale");

-- Down

DROP INDEX "users_usernameNorm";

DROP INDEX "authenticators_type";
DROP INDEX "authenticators_userId";

DROP INDEX "census_locale_edition";
DROP INDEX "census_fingerprint";

DROP INDEX "emails_email";

DROP INDEX "nouns_locale";
DROP INDEX "nouns_masc";

DROP INDEX "inclusive_locale";
DROP INDEX "inclusive_insteadOf";

DROP INDEX "terms_locale";
DROP INDEX "terms_term";

DROP INDEX "profiles_locale";
DROP INDEX "profiles_userId";
DROP INDEX "profiles_locale_userId";

DROP INDEX "sources_locale";
