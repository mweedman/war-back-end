CREATE TABLE stats (
  id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
  userid INTEGER REFERENCES users(id) ON DELETE CASCADE,
  wins INTEGER,
  games_played INTEGER,
  date_modified TIMESTAMP DEFAULT now() NOT NULL
)