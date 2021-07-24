-- Up

CREATE TABLE reports (
     id TEXT NOT NULL PRIMARY KEY,
     userId TEXT NOT NULL,
     reporterId TEXT NULL,
     comment TEXT NOT NULL,
     isAutomatic INTEGER,
     isHandled INTEGER,

     FOREIGN KEY(userId) REFERENCES users(id),
     FOREIGN KEY(reporterId) REFERENCES users(id)
);

CREATE INDEX "reports_isAutomatic" ON "reports" ("isAutomatic");
CREATE INDEX "reports_isHandled" ON "reports" ("isHandled");

-- Down

DROP TABLE reports;
