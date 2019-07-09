const mysql = require('mysql');
const inquirer = require('inquirer');

var connection = mysql.createConnection({
    host: "localhost",  
    port: 3306, // Your port; if not 3306
    user: "jdahle", // Your username
    password: "JD@mbpsql5494", // Your password
    database: "bamazon"
});

customerView();

function openConnection() {
    connection.connect(function(err) {
        if (err) throw err;
        // console.log("Connected as id " + connection.threadId);
    });
}

function closeConnection() {
    connection.end();
}

function customerView () {
    openConnection();
    let querySQL = 'SELECT item_id, product_name, price FROM products';
    connection.query(querySQL, (e, r) => {
        if (e) throw e;
        let msg = '';
        // console.log(r);
        msg += '\nLIST OF PRODUCTS FOR SALE\n';
        msg += '=========================\n';
        msg += rightPad('Item ID', 8, ' ');
        msg += rightPad('Product', 60, ' ');
        msg += leftPad('Price', 8, ' ');
        msg += '\n';
        msg += rightPad('', 76, '-');
        console.log(msg);
        for (let i = 0; i < r.length; i++) {
            msg = '';
            msg += rightPad(r[i].item_id, 8, ' ');
            msg += rightPad(r[i].product_name, 60, ' ');
            msg += leftPad(r[i].price, 8, ' ');
            console.log (msg);
        }
        console.log('\n');
        customerSelect();
    });
    
}

function rightPad(string, len, padchar) {
    len -= string.toString().length;
    let emptyString = padchar.repeat(len);
    let newString = string + emptyString;
    //newString = newString.substring(0, len);
    return newString;
}

function leftPad (string, len, padchar) {
    len -= string.toString().length;
    let emptyString = padchar.repeat(len);
    let newString = emptyString + string;
    // newString = newString.substring(0, len);
    return newString;
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
    .then( function (r) {
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
        closeConnection();
    });

}


