BEGIN;

TRUNCATE
  stats,
  tricks,
  hands,
  game,
  accounts
  RESTART IDENTITY CASCADE;

INSERT INTO accounts (user_name, user_password, email_address)
VALUES
  ('michael', '$2y$12$G68x5L3eVq6NxlOp4bihWOFtBd6vdYcLAs9EUnBTfQymQqQfLSz3e', 'michael.weedman@gmail.com'),
  ('mweedman', '$2a$12$eYLFP5eXWH2qBHg7eya97.Fzes34GiyWJFvDSxBBzLL/FWjxrZ44S', 'michael.weedman@gmail.com');

COMMIT;