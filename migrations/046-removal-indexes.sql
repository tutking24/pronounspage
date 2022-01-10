-- Up

CREATE UNIQUE INDEX "users_username" ON "users" ("username");
CREATE UNIQUE INDEX "users_email" ON "users" ("email");

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

CREATE INDEX "reports_isAutomatic" ON "reports" ("isAutomatic");
CREATE INDEX "reports_isHandled" ON "reports" ("isHandled");

CREATE INDEX "names_name_locale" ON "names" ("locale", "name");
CREATE INDEX "names_name" ON "names" ("name");
CREATE INDEX "names_locale" ON "names" ("locale");

CREATE INDEX "profiles_teamName" ON "profiles" ("teamName");
CREATE INDEX "profiles_footerName" ON "profiles" ("footerName");
CREATE INDEX "profiles_footerAreas" ON "profiles" ("footerAreas");
CREATE INDEX "reports_userId" ON "reports" ("userId");

-- Down

