BEGIN;

TRUNCATE
  stats,
  tricks,
  hands,
  game,
  accounts
  RESTART IDENTITY CASCADE;

INSERT INTO accounts (user_name, user_password)
VALUES
  ('michael', '$2y$12$tCNdl4HLgWAzCPAAXLUk9O7oxWJi6dyyU6.DhqvpyVTcqMFVPG06i');

COMMIT;