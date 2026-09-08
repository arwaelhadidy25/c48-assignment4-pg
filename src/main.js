//Assignment part 3 (required database tables in migrations directory
const {config}=require('dotenv');
config(); //to make it deal with .env folder as environment not windows environment
const express = require('express');
const app = express();
app.use(express.json());
const { Client,Pool } = require("pg")
//establish connection database
const pool = new Pool({
    host: process.env.DB_HOST,
    port:process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database:process.env.DB_DATABASE,
});
//--------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------
/**
*2. Create REST API endpoints to perform CRUD operations for the Products table: (2.5 Grade)
● Create a product.
● Retrieve all products.
● Retrieve a product by ID.
● Update a product.
● Delete a product. */
//Add a Category column to the Products table. ✅ checked
//q5 endpoint come before /products/:id
app.post('/products/add-category', async (req, res) => {
    try {
        await pool.query(`ALTER TABLE products ADD COLUMN category VARCHAR(100)`);
        res.status(200).json({status: 'OK', message: 'Category column added successfully'});}
    catch (err) {
        res.status(500).json({status: 'error', message: err.message});
    }
});
//-------------------------------------------------------------------------
//q5 endpoint come before /products/:id
//Remove the Category column. ✅ checked
app.delete('/products/remove-category', async (req, res) => {
    try {await pool.query(`ALTER TABLE products DROP COLUMN category`);

        res.status(200).json({status: 'OK', message: 'Category column removed successfully'});
    }
    catch (err) {
        res.status(500).json({status: 'error', message: err.message});
    }
})
//----------------------------------------------------------------------
//add name not null ✅ checked
app.post('/products/add-name-not-null', async (req, res) => {
    try {
        await pool.query(`ALTER TABLE products ALTER COLUMN name SET NOT NULL`);

        res.status(200).json({status: 'OK', message: 'Product name is now NOT NULL'});
    }
    catch (err) {
        res.status(500).json({status: 'error', message: err.message});
    }
});
//-----------------------------------------------------------------------
//q7 endpoint come before /products/:id 7. Create an API endpoint to update the price of 'Bread' to 25.00. ✅ checked
app.post('/products/update-price',async (req,res)=>{
try {
    const{rows}= await pool.query(`UPDATE products SET price=25.00 WHERE name='Bread' RETURNING price,name`)
    if(rows.length===0){
        const error=new Error('Product not found')
        throw error
    }
    res.status(200).json({status: 'OK', message: 'Bread price updated successfully'});
}
catch (err) {
    res.status(500).json({status: 'error', message: err.message});
}
})
//-----------------------------------------------------------------------
//delete eggs q8 Create an API endpoint to delete the product 'Eggs'. (0.5 Grade) ✅ checked
app.delete('/products/delete-eggs', async (req, res) => {
    try {
        const { rows } = await pool.query(
            `DELETE FROM products WHERE name='Eggs' RETURNING id`
        );
        if (rows.length === 0) {
            return res.status(404).json({ status: 'error', message: 'Eggs not found' });
        }
        res.status(200).json({ status: 'OK', message: 'Eggs deleted successfully' });
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
});
//------------------------------------------------------------------------
//create product ✅ checked
//we should make a supplier before product
app.post('/products',async (req,res)=>{
try{
    const {productName,price,stock,supplierId} = req.body;
    const {rows} =await pool.query('INSERT INTO products (name, price,stock,supplier_id) VALUES ($1, $2,$3,$4) RETURNING *',[productName,price,stock,supplierId])
    res.status(201).json({status:'OK',data:rows[0]})}
catch(err){
    console.log(err)
    res.status(500).json({ status: 'error', message: err.message })
    }
})
//--------------------------------------------------------------------------------------
//get all products ✅ checked
app.get('/products',async (req,res)=>{
    try {
        const {rows}= await pool.query('SELECT * FROM products')
        res.status(200).json({status:'OK',data:rows})
    }
    catch(err){
        res.status(500).json({status: 'error', message: err.message})
    }
})
//--------------------------------------------------------------------------------------
//get product with id ✅ checked
app.get('/products/:id',async (req,res)=>{
    try {
        const id =req.params.id;
        const{rows: productWithId}= await pool.query('SELECT * FROM products WHERE id=$1',[id])
        if(productWithId.length===0){
            return res.status(404).json({status:'error', message:'Product not found'})
        }
        res.status(200).json({status:'OK',data:productWithId[0]})
    }
    catch(err){
        res.status(500).json({ status: 'error', message: err.message })
    }
})
//--------------------------------------------------------------------------------------
//update product ✅ checked
app.put('/products/:id',async (req,res)=>{
try {
    const id =req.params.id;
    const {productName,price}=req.body;
    const {rows: updatedProduct}=await pool.query('UPDATE products SET price=$1, name =$2 WHERE id=$3 RETURNING *',[price,productName,id])
    if(updatedProduct.length===0){
        return res.status(404).json({status:'error', message:'Product not found'})
    }
    res.status(200).json({status:'OK',data:updatedProduct[0] })
}
catch(err){
    res.status(500).json({ status: 'error', message: err.message })
}
})
//--------------------------------------------------------------------------------------
//Delete Product ✅ checked
app.delete('/products/:id',async (req,res)=>{
try {
    const id =req.params.id;
    const {rows}=await pool.query('DELETE FROM products WHERE id=$1 RETURNING id',[id])
    if(rows.length===0){
        const error =new Error('Product not found')
        throw error
    }
    res.status(200).json({status:'OK'})
}
catch(err){
    res.status(500).json({ status: 'error', message: err.message })
}
})
//-----------------------------------------------------------------------------
//-----------------------------------------------------------------------------
/**
* 3. Create REST API endpoints to perform CRUD operations for the Suppliers table
● Create a supplier.
● Retrieve all suppliers.
● Update supplier information.
● Delete a supplier.*/

//create supplier ✅ checked
app.post('/suppliers',async (req,res)=>{
    try {
        const {supplierName,contactNumber}=req.body;
        const {rows}=await pool.query('INSERT INTO suppliers (supplier_name,contact_number) VALUES ($1,$2) RETURNING *',[supplierName,contactNumber])
        res.status(201).json({status:'OK',data:rows[0]})
    }
    catch(err){
        res.status(500).json({ status: 'error', message: err.message })
    }
})
//-----------------------------------------------------------------------------
//get all suppliers ✅ checked
app.get('/suppliers',async (req,res)=>{
    try {
        const{rows}=await pool.query('SELECT * FROM suppliers')
        res.status(200).json({status:'OK',data:rows})
    }
    catch(err){
        res.status(500).json({ status: 'error', message: err.message })
    }
})
//-----------------------------------------------------------------------------
//update supplier ✅ checked
app.put('/suppliers/:id',async (req,res)=>{
    try {
        const id =req.params.id;
        const {supplierName,contactNumber}=req.body;
        const {rows: updatedSupplier}=await pool.query('UPDATE suppliers SET supplier_name=$1, contact_number =$2 WHERE id=$3 RETURNING *',[supplierName,contactNumber,id])
        if(updatedSupplier.length===0){
            const error =new Error('Supplier not found')
            throw error
        }
        res.status(200).json({status:'OK',data:updatedSupplier[0] })
    }
    catch(err){
        res.status(500).json({ status: 'error', message: err.message })
    }
})
//-----------------------------------------------------------------------------
//delete supplier ✅ checked
app.delete('/suppliers/:id',async (req,res)=>{
    try {
        const id =req.params.id;
        const {rows}=await pool.query('DELETE FROM suppliers WHERE id=$1 RETURNING id',[id])
        if(rows.length===0){
            const error =new Error('Supplier not found')
            throw error
        }
        res.status(200).json({status:'OK'})
    }
    catch(err){
        res.status(500).json({ status: 'error', message: err.message })
    }
})
//-----------------------------------------------------------------------------
//-----------------------------------------------------------------------------
/**
 * 4. Create REST API endpoints to manage Sales : (1.5 Grade)
 * ● Record a sale.
 * ● Retrieve all sales.
 * ● Retrieve sales for a specific product.
 */
//record a sale ✅ checked
app.post("/sales",async (req,res)=>{
    try {
        const { productId, quantitySold } = req.body;
        const {rows}=await pool.query(`INSERT INTO sales (product_id, quantity_sold) VALUES ($1, $2) RETURNING *`,[productId,quantitySold])
        res.status(201).json({status:'OK',data:rows})
    }
    catch(err){
        res.status(500).json({ status: 'error', message: err.message })
    }

})
//---------------------------------------------------------------------------
//Retrieve all sales ✅ checked
app.get('/sales', async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT * FROM sales');

        res.status(200).json({status: 'OK', data: rows});
    }
    catch (err) {
        res.status(500).json({status: 'error', message: err.message});
    }
});
//---------------------------------------------------------------------------

//Retrieve sales for a specific product. ✅ checked
app.get('/sales/product/:productId', async (req, res) => {
    try {const productId = req.params.productId;
        const { rows } = await pool.query('SELECT * FROM sales WHERE product_id = $1', [productId]);
        if(rows.length===0){
            return res.status(404).json({status:'error', message:'Product without sales'})
        }
        res.status(200).json({status: 'OK', data: rows});
    }

    catch (err) {
        res.status(500).json({status: 'error', message: err.message
        });
    }
});
//----------------------------------------------------------------------------
//----------------------------------------------------------------------------
/**
 * 5. Create API endpoints to perform the following database modifications:
 * ● Add a Category column to the Products table.
 * ● Remove the Category column.
 * ● Change ContactNumber to VARCHAR(15).
 * ● Add a NOT NULL constraint to ProductName.
 */
//move 2 api end-points before /products/:id
// //Add a Category column to the Products table. ✅ checked
// app.post('/products/add-category', async (req, res) => {
//     try {
//         await pool.query(`ALTER TABLE products ADD COLUMN category VARCHAR(100)`);
//         res.status(200).json({status: 'OK', message: 'Category column added successfully'});}
//     catch (err) {
//         res.status(500).json({status: 'error', message: err.message});
//     }
// });
// //-------------------------------------------------------------------------
// //Remove the Category column. ✅ checked
// app.delete('/products/remove-category', async (req, res) => {
//     try {await pool.query(`ALTER TABLE products DROP COLUMN category`);
//
//         res.status(200).json({status: 'OK', message: 'Category column removed successfully'});
//     }
//     catch (err) {
//         res.status(500).json({status: 'error', message: err.message});
//     }
// })
//------------------------------------------------------------------
//Change ContactNumber to VARCHAR(15). ✅ checked
app.post('/suppliers/change-contact-number', async (req, res) => {
    try {
        await pool.query(`ALTER TABLE suppliers ALTER COLUMN contact_number TYPE VARCHAR(15)`);

        res.status(200).json({status: 'OK', message: 'Contact number changed to VARCHAR(15)'});}
    catch (err) {
        res.status(500).json({status: 'error', message: err.message});
    }
});
//-----------------------------------------------------------------------
//Add a NOT NULL constraint to ProductName. ✅ checked
// app.post('/products/add-name-not-null', async (req, res) => {
//     try {
//         await pool.query(`ALTER TABLE products ALTER COLUMN name SET NOT NULL`);
//
//         res.status(200).json({status: 'OK', message: 'Product name is now NOT NULL'});
//     }
//     catch (err) {
//         res.status(500).json({status: 'error', message: err.message});
//     }
// });
//-----------------------------------------------------------------------------
//-----------------------------------------------------------------------------
/**
 * 6. Create an API endpoint or initialization script to insert the following data
 * a. Add a supplier with the name 'FreshFoods' and contact number '01001234567'.
 * b. Insert the following three products, all provided by 'FreshFoods':
 * i. 'Milk' with a price of 15.00 and stock quantity of 50.
 * ii. 'Bread' with a price of 10.00 and stock quantity of 30.
 * iii. 'Eggs' with a price of 20.00 and stock quantity of 40.
 * c. Add a record for the sale of 2 units of 'Milk' made on '2025-05-20'.
 */
//✅ done
/**
 * {
 *   "supplier": {
 *     "supplier_name": "FreshFoods",
 *     "contact_number": "01001234567"
 *   },
 *   "products": [
 *     {
 *       "name": "Milk",
 *       "price": 15,
 *       "stock": 50
 *     },
 *     {
 *       "name": "Bread",
 *       "price": 10,
 *       "stock": 30
 *     },
 *     {
 *       "name": "Eggs",
 *       "price": 20,
 *       "stock": 40
 *     }
 *   ],
 *   "sale": {
 *     "product_name": "Milk",
 *     "quantity_sold": 2,
 *     "sale_date": "2025-05-20"
 *   }
 * }
 */
//with this body
app.post('/sales/insert-spacific-data', async (req, res) => {
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        // Get data from body
        const { supplier, products, sale } = req.body;

        // 1. Add supplier
        const { rows: supplierRows } = await client.query(
            `INSERT INTO suppliers(supplier_name, contact_number) VALUES ($1, $2) RETURNING id`,
            [
                supplier.supplier_name,
                supplier.contact_number
            ]
        );

        const supplierId = supplierRows[0].id;


        // 2. Add products
        const { rows: productRows } = await client.query(
            `INSERT INTO products (name, price, stock, supplier_id)
             VALUES ($1, $2, $3, $4),
                    ($5, $6, $7, $8),
                    ($9, $10, $11, $12)
                 RETURNING id, supplier_id, name`,
            [
                products[0].name, products[0].price, products[0].stock, supplierId,
                products[1].name, products[1].price, products[1].stock, supplierId,
                products[2].name, products[2].price, products[2].stock, supplierId
            ]
        );

        // 3. Get the product sold
        const productToSell = productRows.find(
            product => product.id === sale.product_name
        );

        if (!productToSell) {
            throw new Error('Product not found');
        }


        // 4. Add sale
        await client.query(
            `INSERT INTO sales (product_id, quantity_sold, sale_date)
             VALUES ($1, $2, $3)`,
            [
                productToSell.id,
                sale.quantity_sold,
                sale.sale_date
            ]
        );


        // Everything succeeded
        await client.query('COMMIT');

        res.status(200).json({
            status: 'OK',
            message: 'insert data successfully'
        });

    } catch (err) {

        // Something failed
        await client.query('ROLLBACK');

        res.status(500).json({
            status: 'error',
            message: err.message
        });

    } finally {

        client.release();

    }
});
//-------------------------------------------------------------------
//-------------------------------------------------------------------
/**
 * 7.Create an API endpoint to update the price of 'Bread' to 25.00.
 */
// app.post('/products/update-price',async (req,res)=>{
//     try {
//         const{rows}= await pool.query(`UPDATE products SET price=25.00 WHERE name='Bread' RETURNING price,name`)
//         if(rows.length===0){
//             const error=new Error('Product not found')
//             throw error
//         }
//         res.status(200).json({status: 'OK', message: 'Bread price updated successfully'});
//     }
//     catch (err) {
//         res.status(500).json({status: 'error', message: err.message});
//     }
// })
//-------------------------------------------------------------
/**
 * 8. Create an API endpoint to delete the product 'Eggs'. (0.5 Grade)
 */
// app.delete('/products/delete-eggs', async (req, res) => { ✅ checked
//     try {
//         const { rows } = await pool.query(
//             `DELETE FROM products WHERE name='Eggs' RETURNING id`
//         );
//         if (rows.length === 0) {
//             return res.status(404).json({ status: 'error', message: 'Eggs not found' });
//         }
//         res.status(200).json({ status: 'OK', message: 'Eggs deleted successfully' });
//     } catch (err) {
//         res.status(500).json({ status: 'error', message: err.message });
//     }
// });
//-----------------------------------------------------------------------
/**
 * 9. Create a reporting endpoint to retrieve the total quantity sold for each product using SQL aggregate functions.
 */
app.get('/reports/total-sold', async (req, res) => { //✅ checked
    try {
        const { rows } = await pool.query(
            `SELECT product_id, SUM(quantity_sold) AS total_sold
             FROM sales
             GROUP BY product_id`
        );
        res.status(200).json({ status: 'OK', data: rows });
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
});
//-------------------------------------------------------------
/**
 * 10. Create a reporting endpoint to retrieve the product with the highest stock quantity. (0.5 Grade)
 */
app.get('/reports/highest-stock', async (req, res) => { //✅ checked
    try {
        const { rows } = await pool.query(
            `SELECT * FROM products ORDER BY stock DESC LIMIT 1`
        );
        res.status(200).json({ status: 'OK', data: rows[0] });
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
});
//-------------------------------------------------------------
/**
 * 11. Create a reporting endpoint to retrieve suppliers whose names start with 'F'. (0.5 Grade)
 */
app.get('/reports/suppliers-starting-f', async (req, res) => { //✅ checked
    try {
        const { rows } = await pool.query(
            `SELECT * FROM suppliers WHERE supplier_name LIKE 'F%'`
        );
        res.status(200).json({ status: 'OK', data: rows });
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
});
//----------------------------------------------------------------------
/**
 * 12. Create a reporting endpoint to retrieve all products that have never been sold. (0.5 Grade)
 */
app.get('/reports/never-sold', async (req, res) => { //✅ checked
    try {
        const { rows } = await pool.query(`SELECT products.id,products.name,products.stock,products.supplier_id FROM products
                                                        LEFT JOIN sales ON products.id = sales.product_id
                                                          WHERE sales.product_id IS NULL;`);
        res.status(200).json({ status: 'OK', data: rows });
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
});
/**
 * 13. Create a reporting endpoint to retrieve all sales including:
 * ● Product name
 * ● Quantity sold
 * ● Sale date using SQL JOIN operations.
 */
app.get('/reports/sales-details', async (req, res) => { //✅ checked
    try {
        const { rows } = await pool.query(
            `SELECT products.id,products.name, sales.quantity_sold, sales.sale_date FROM sales
             LEFT JOIN products ON sales.product_id = products.id`
        );
        res.status(200).json({ status: 'OK', data: rows });
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
});
/**
 * 14. Create a SQL script or secure administrative endpoint to create a MySQL user named store_manager and grant the
 * following permissions on all tables: (0.5 Grade)
 * ● SELECT
 * ● INSERT
 * ● UPDATE
 */
// CREATE USER store_manager WITH PASSWORD '1234';
// GRANT SELECT, INSERT, UPDATE ON ALL TABLES IN SCHEMA public TO store_manager;
/**
 * 15. Revoke the UPDATE permission from “store_manager”. (0.5 Grade)
 */
//REVOKE UPDATE ON ALL TABLES IN SCHEMA public FROM store_manager;
/**
 * 16. Grant DELETE permission to “store_manager” only on the Sales table. (0.5 Grade)
 */
//GRANT DELETE ON sales TO store_manager;
app.listen(3000,()=>{
    console.log("Server started on port 3000");
});
