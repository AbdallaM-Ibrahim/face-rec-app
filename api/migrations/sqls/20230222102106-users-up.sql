CREATE TABLE users (
  id SERIAL NOT NULL PRIMARY KEY,
  email varchar(255) NOT NULL,
  name varchar(255) NOT NULL,
  joined date NOT NULL,
  entries int default 0
);