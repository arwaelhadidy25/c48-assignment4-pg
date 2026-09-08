## Products

- get all products
- url: /products
- method: GET
- request-body: none
- response-body: { 'status': 'OK', 'data': products }

---

- get product by id
- url: /products/:id
- method: GET
- request-body: none
- response-body: { 'status': 'OK', 'data': product }
- response-body: { 'status': 'error', 'message': 'Product not found' }

---

- create product
- url: /products
- method: POST
- request-body: { 'productName': 'Milk', 'price': 15.00, 'stock': 50, 'supplierId': 1 }
- response-body: { 'status': 'OK', 'data': product }

---

- update product
- url: /products/:id
- method: PUT
- request-body: { 'productName': 'Milk', 'price': 18.00 }
- response-body: { 'status': 'OK', 'data': product }
- response-body: { 'status': 'error', 'message': 'Product not found' }

---

- delete product
- url: /products/:id
- method: DELETE
- request-body: none
- response-body: { 'status': 'OK' }
- response-body: { 'status': 'error', 'message': 'Product not found' }

---

## Suppliers

- get all suppliers
- url: /suppliers
- method: GET
- request-body: none
- response-body: { 'status': 'OK', 'data': suppliers }

---

- create supplier
- url: /suppliers
- method: POST
- request-body: { 'supplierName': 'FreshFoods', 'contactNumber': '01001234567' }
- response-body: { 'status': 'OK', 'data': supplier }

---

- update supplier
- url: /suppliers/:id
- method: PUT
- request-body: { 'supplierName': 'FreshFoods', 'contactNumber': '01009999999' }
- response-body: { 'status': 'OK', 'data': supplier }
- response-body: { 'status': 'error', 'message': 'Supplier not found' }

---

- delete supplier
- url: /suppliers/:id
- method: DELETE
- request-body: none
- response-body: { 'status': 'OK' }
- response-body: { 'status': 'error', 'message': 'Supplier not found' }
- note: deleting a supplier deletes all its products automatically (ON DELETE CASCADE)

---

## Sales

- record a sale
- url: /sales
- method: POST
- request-body: { 'productId': 1, 'quantitySold': 2 }
- response-body: { 'status': 'OK', 'data': sale }

---

- get all sales
- url: /sales
- method: GET
- request-body: none
- response-body: { 'status': 'OK', 'data': sales }

---

- get sales for a specific product
- url: /sales/product/:productId
- method: GET
- request-body: none
- response-body: { 'status': 'OK', 'data': sales }
- response-body: { 'status': 'error', 'message': 'Product without sales' }
- note: deleting a product that has sales is blocked (ON DELETE RESTRICT)

---

## Database Modifications

- add category column to products
- url: /products/add-category
- method: POST
- request-body: none
- response-body: { 'status': 'OK', 'message': 'Category column added successfully' }

---

- remove category column from products
- url: /products/remove-category
- method: POST
- request-body: none
- response-body: { 'status': 'OK', 'message': 'Category column removed successfully' }

---

- add NOT NULL constraint to product name
- url: /products/add-name-not-null
- method: POST
- request-body: none
- response-body: { 'status': 'OK', 'message': 'Product name is now NOT NULL' }

---

- change supplier contact number to VARCHAR(15)
- url: /suppliers/change-contact-number
- method: POST
- request-body: none
- response-body: { 'status': 'OK', 'message': 'Contact number changed to VARCHAR(15)' }

---

##  Insert Specific Data

- insert specific seed data (FreshFoods supplier + Milk/Bread/Eggs + one sale)
- url: /sales/insert-spacific-data
- method: POST
- request-body: {"supplier": {"supplier_name": "FreshFoods","contact_number": "01001234567"},
  "products": [{"name": "Milk","price": 15,"stock": 50 }, {"name": "Bread","price": 10,"stock": 30 }, {"name": "Eggs","price": 20,"stock": 40 }],
  "sale": {"product_name": "Milk","quantity_sold": 2,"sale_date": "2025-05-20" } }
- response-body: { 'status': 'OK', 'message': 'insert data successfully' }
- response-body: { 'status': 'error', 'message': err.message }

---

- update Bread price to 25.00
- url: /products/update-price
- method: POST
- request-body: none
- response-body: { 'status': 'OK', 'message': 'Bread price updated successfully' }

---

- delete Eggs
- url: /products/delete-eggs
- method: DELETE
- request-body: none
- response-body: { 'status': 'OK', 'message': 'Eggs deleted successfully' }
- response-body: { 'status': 'error', 'message': 'Eggs not found' }

---

## Reports

- total quantity sold per product
- url: /reports/total-sold
- method: GET
- request-body: none

---

- product with highest stock
- url: /reports/highest-stock
- method: GET
- request-body: none
- response-body: { 'status': 'OK', 'data': product }

---

- suppliers whose name starts with 'F'
- url: /reports/suppliers-starting-f
- method: GET
- request-body: none
- response-body: { 'status': 'OK', 'data': suppliers }

---

- products never sold
- url: /reports/never-sold
- method: GET
- request-body: none
- response-body: { 'status': 'OK', 'data': products }

---

- all sales with product name (JOIN)
- url: /reports/sales-details
- method: GET
- request-body: none