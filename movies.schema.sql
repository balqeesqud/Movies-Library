DROP TABLE IF EXISTS movies;
CREATE TABLE IF NOT EXISTS movies(
  id SERIAL PRIMARY KEY,
  title VARCHAR(200),
  release_year INTEGER,
  overView VARCHAR(200),
  comment VARCHAR(200)
); 

