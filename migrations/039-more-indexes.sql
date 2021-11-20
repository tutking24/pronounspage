-- Up

CREATE INDEX "profiles_teamName" ON "profiles" ("teamName");
CREATE INDEX "profiles_footerName" ON "profiles" ("footerName");
CREATE INDEX "profiles_footerAreas" ON "profiles" ("footerAreas");

CREATE INDEX "reports_userId" ON "reports" ("userId");

-- Down

DROP INDEX "profiles_teamName";
DROP INDEX "profiles_footerName";
DROP INDEX "profiles_footerAreas";

DROP INDEX "reports_userId";
