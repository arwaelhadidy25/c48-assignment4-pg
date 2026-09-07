CREATE TYPE user_role AS ENUM ('admin', 'customer');

CREATE TABLE users(
                      id SERIAL PRIMARY KEY,
                      email VARCHAR(255) UNIQUE NOT NULL CHECK ( position('@' IN email)>0),
                      first_name VARCHAR(255) NOT NULL,
                      phone TEXT,
                      last_name VARCHAR(255) NOT NULL,
                      role user_role DEFAULT 'customer',
                      user_name VARCHAR(255) NOT NULL,
                      password TEXT NOT NULL
);

CREATE TABLE products(
                         id SERIAL PRIMARY KEY,
                         name VARCHAR(255) UNIQUE NOT NULL,
                         stock INTEGER NOT NULL DEFAULT 1 check ( stock >= 0 ),
                         is_Deleted BOOLEAN NOT NULL DEFAULT false,
                         price NUMERIC(10,2) NOT NULL check ( price > 0 ),
                         user_id INTEGER REFERENCES users(id)
);