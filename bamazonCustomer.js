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


function customerView () {
    common.openConnection(connection);
    let querySQL = 'SELECT item_id, product_name, price FROM products';
    connection.query(querySQL, (e, r) => {
        if (e) throw e;
        let msg = '';
        // console.log(r);
        msg += '\nLIST OF PRODUCTS FOR SALE\n';
        msg += '=========================\n';
        msg += common.rightPad('Item ID', 8, ' ');
        msg += common.rightPad('Product', 60, ' ');
        msg += common.leftPad('Price', 8, ' ');
        msg += '\n';
        msg += common.rightPad('', 76, '-');
        console.log(msg);
        for (let i = 0; i < r.length; i++) {
            msg = '';
            msg += common.rightPad(r[i].item_id, 8, ' ');
            msg += common.rightPad(r[i].product_name, 60, ' ');
            msg += common.leftPad(r[i].price, 8, ' ');
            console.log (msg);
        }
        console.log('\n');
        customerSelect();
    });
    
}

function  customerSelect () {
    inquirer.prompt([{
        type: 'number',
        name: 'item_num',
        validate: (item_num) => {
            return Number.isInteger(item_num) ? true : 'Enter a whole number';
        },
        message: 'Enter the Item ID (# above) of the product you wish to purcahse'
    },
    {
        type: 'number',
        name: 'item_qty',
        validate: (item_qty) => {
            return Number.isInteger(item_qty) ? true : 'Enter a whole number';
        },
        message: `Enter the quantity you wish to purcahse`
    }])
    .then( (r) => {
        let id = r.item_num;
        let qty = r.item_qty;
        //console.log(id,qty);
        fillOrder(id, qty);
    });
}

function fillOrder(itemId, itemQty) {
    let querySQL = `select stock_quantity, price from products where item_id = ${itemId}`;
    connection.query(querySQL, (e,r) => {
        if(e) throw e;
        inStock = r[0].stock_quantity;
        itemPrice = r[0].price;
        if (inStock < itemQty) {
            console.log (`Insufficient inventory to complete order.\nYou wanted to purchase ${itemQty}, but we only have ${inStock}\n`);
        } else {
            let newQty = inStock - itemQty;
            let totalCost = itemQty * itemPrice;
            let updateSQL = `update products set stock_quantity = ${newQty} where item_id = ${itemId}`;
            connection.query(updateSQL, (err, res) => {
                if (err) throw err;
                console.log(`Your order is complete\nThe total cost of your order was ${totalCost.toFixed(2)}\n`);
            });
        }
        common.closeConnection(connection);
    });

}


