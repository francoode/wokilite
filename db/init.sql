CREATE TABLE IF NOT EXISTS customers (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT NOT NULL,
    createdAt TEXT NOT NULL DEFAULT (datetime('now'))
    updatedAt TEXT NOT NULL DEFAULT (datetime('now'))
);