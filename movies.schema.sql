DROP TABLE IF EXISTS movies;
CREATE TABLE IF NOT EXISTS movies(
  id SERIAL PRIMARY KEY,
  title VARCHAR(200),
  release_year VARCHAR(200),
  overView VARCHAR(200),
  comment VARCHAR(200)
); 

