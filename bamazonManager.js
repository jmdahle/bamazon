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

common.openConnection(connection);

managerOptions();

function managerOptions() {
    inquirer.prompt({
        type: 'list',
        name: 'selectedAction',
        message: 'Select an activity',
        choices: [
            {name:'View Products for Sale', value:'viewProd'},
            {name:'View Low Inventory', value:'viewLowInv'},
            {name:'Add to Inventory', value:'addInv'},
            {name:'Add New Product', value:'addNew'},
            {name:'Exit', value:'exit'}
        ]
    }).then( (r) => {
        console.log(r);
        switch (r.selectedAction) {
            case 'viewProd':
                viewProducts();
                break;
            case 'viewLowInv':
                viewLowInventory();
                break;
            case 'addInv':
                addInventory();
                break;
            case 'addNew':
                break;
            case 'exit':
                exitProgram();
                break;
            default:
                console.log('Unrecognized action');
                exitProgram();
                break;
        }
    });
}

function viewProducts () {
    let querySQL = 'SELECT item_id, product_name, price, stock_quantity FROM products';
    connection.query(querySQL, (e, r) => {
        if (e) throw e;
        let title = 'LIST OF ALL PRODUCTS FOR SALE';
        displayProductTable(title, r);
        console.log('\n');
        managerOptions();
    });
}

function viewLowInventory () {
    let querySQL = 'SELECT item_id, product_name, price, stock_quantity FROM products WHERE stock_quantity < 5';
    connection.query(querySQL, (e,r) => {
        if (e) throw e;
        let title = 'LIST OF PRODUCTS WITH LOW INVENTORY';
        displayProductTable(title, r)
        console.log('\n');
        managerOptions();
    });
}

function displayProductTable(title, r) {
    let msg = '';
    // console.log(r);
    msg += `\n${title}\n`;
    msg += '='.repeat(title.length);
    msg += '\n';
    msg += common.rightPad('Item ID', 8, ' ');
    msg += common.rightPad('Product', 45, ' ');
    msg += common.leftPad('Quantity', 15, ' ');
    msg += common.leftPad('Price', 8, ' ');
    msg += '\n';
    msg += common.rightPad('', 76, '-');
    console.log(msg);
    if (r.length > 0) {
        for (let i = 0; i < r.length; i++) {
            msg = '';
            msg += common.rightPad(r[i].item_id, 8, ' ');
            msg += common.rightPad(r[i].product_name, 45, ' ');
            msg += common.leftPad(r[i].stock_quantity, 15, ' ');
            msg += common.leftPad(r[i].price, 8, ' ');
            console.log (msg);
        }
    } else {
        console.log(`No records found`);
    }
}

function addInventory () {
    // update db
    let inventory = []; // load the array of choices and current inventory
    let querySQL = 'select item_id, product_name, stock_quantity from products';
    connection.query(querySQL, (e,r) => {
        if (e) throw e;
        for (let i = 0; i < r.length; i ++) {
            let record = {
                name: r[i].product_name,
                value: r[i].item_id
            }
            inventory.push(record);
        }
        console.log(inventory);
        inquirer.prompt([
            {
            type: 'list',
            name: 'selectedItem',
            message: 'Choose an item to restock',
            choices: inventory
            }, {
            type: 'number',
            name: 'addQty',
            message: 'Enter the amount to restock',
            validate: (addQty) => {
                return Number.isInteger(addQty) ? true : 'Enter a whole number';
                }
            }
            ]). then ( (r) => {
            console.log(r);

            managerOptions();
        });
    });
}

function exitProgram () {
    console.log ('\nGoodbye.\n');
    common.closeConnection(connection);
}