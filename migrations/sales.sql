CREATE TABLE sales(
    id SERIAL primary key ,
    product_id INT NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
    quantity_sold INT DEFAULT 1 NOT NULL check ( quantity_sold>0 ),
    sale_date DATE DEFAULT NOW() NOT NULL
)