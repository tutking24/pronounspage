-- Up

CREATE TABLE subscription_messages (
    id TEXT PRIMARY KEY,
    subscription_id TEXT NOT NULL REFERENCES subscriptions (id),
    campaign TEXT NOT NULL
)

-- Down
