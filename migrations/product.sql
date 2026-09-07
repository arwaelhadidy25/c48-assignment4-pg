CREATE TABLE products(
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    price NUMERIC(10,2) NOT NULL check ( price>=0 ),
    stock INT NOT NULL DEFAULT 1 check ( stock >=0 ),
    supplier_id INT REFERENCES suppliers(id) ON DELETE CASCADE
);