-- Up

CREATE UNIQUE INDEX "users_username" ON "users" ("username");
CREATE UNIQUE INDEX "users_email" ON "users" ("email");

-- Down

DROP INDEX "users_email";
DROP INDEX "users_username";
