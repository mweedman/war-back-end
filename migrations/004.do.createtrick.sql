CREATE TABLE tricks (
  id INTEGER PRIMARY KEY GENERATED BY DEFAULT NOT NULL,
  game_id INTEGER REFERENCES game(id) ON DELETE CASCADE NOT NULL,
  player1play INTEGER[] NOT NULL,
  player2play INTEGER[] NOT NULL,
  player3play INTEGER[] NOT NULL,
  player4play INTEGER[] NOT NULL,
  date_modified TIMESTAMP DEFAULT now() NOT NULL,
);