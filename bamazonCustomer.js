const mysql = require('mysql');
const inquirer = require('inquirer');
const common = require('./common.js');

const connection = mysql.createConnection({
    host: "localhost",  
    port: 3306, // Your port; if not 3306
    user: "jdahle", // Your username
    password: "JD@mbpsql5494", // Your password
    database: "bamazon"
});

customerView();

/**
 * Function displays the products for sale to the Customer
 */
function customerView () {
    common.openConnection(connection);
    let querySQL = 'SELECT item_id, product_name, price FROM products where stock_quantity > 0';  // exclude from "where" to premit out-of-stock items
    connection.query(querySQL, (error, result) => {
        if (error) throw error;
        let msg = ''; 
        // console.log(result);
        msg += '\nLIST OF PRODUCTS FOR SALE\n';
        msg += '=========================\n';
        msg += common.rightPad('Item ID', 8, ' ');
        msg += common.rightPad('Product', 60, ' ');
        msg += common.leftPad('Price', 8, ' ');
        msg += '\n';
        msg += common.rightPad('', 76, '-');
        console.log(msg);
        for (let i = 0; i < result.length; i++) {
            msg = '';
            msg += common.rightPad(result[i].item_id, 8, ' ');
            msg += common.rightPad(result[i].product_name, 60, ' ');
            msg += common.leftPad(result[i].price, 8, ' ');
            console.log (msg);
        }
        console.log('\n');
        customerSelect();
    });
    
}

/**
 * Function prompts Customer for purchase (item + quantity)
 * 
 */
function  customerSelect () {
    inquirer.prompt([
        {
        type: 'input',
        name: 'item_num',
        validate: (test_value) => { // check for an integer number > 0
            return (/^\d*$/.test(test_value) && test_value > 0) ?  true : 'Enter a whole number greater than zero';
            },
        message: 'Enter the Item ID (# above) of the product you wish to purchase'
        },
        {
        type: 'input',
        name: 'item_qty',
        validate: (test_value) => { // check for an integer number > 0
            return (/^\d*$/.test(test_value) && test_value > 0) ?  true : 'Enter a whole number from the list above.';
            },
        message: `Enter the quantity you wish to purcahse`
        }
    ])
    .then( (result) => {
        let id = result.item_num;
        let qty = result.item_qty;
        //console.log(id,qty);
        fillOrder(id, qty);
    });
}

/**
 * Function checks inventory for the desired quantity; if there is, function removes the items from inventory and updates total sales for product
 * 
 * @param {int} itemId 
 * @param {int} itemQty 
 */
function fillOrder(itemId, itemQty) {
    let querySQL = `select stock_quantity, price from products where item_id = ${itemId}`;
    connection.query(querySQL, (error,result) => { // check quamtity in inventory
        if (error) throw error;
        if (result.length) {
            inStock = result[0].stock_quantity;
            itemPrice = result[0].price;
            if (inStock < itemQty) {  // notify Customer of insufficient stock and end without completing order
                console.log (`Insufficient inventory to complete order.\nYou wanted to purchase ${itemQty}, but we only have ${inStock}\n`);
            } else { // complete order; reduce stock and update total sales
                let newQty = inStock - itemQty;
                let totalCost = itemQty * itemPrice;
                let updateSQL = `update products set stock_quantity = ${newQty}, product_sales = product_sales + ${totalCost} where item_id = ${itemId}`;
                connection.query(updateSQL, (err, res) => {
                    if (err) throw err;
                    console.log(`Your order is complete\nThe total cost of your order was ${totalCost.toFixed(2)}\n`);
                });
            }
        } else { // if no record returned
            console.log (`No items match the Item ID ${itemId}`);
        }
        common.closeConnection(connection);
    });

}


