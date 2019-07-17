const inquirer = require('inquirer');
const common = require('./common.js');

const connection = common.createConnection();

common.openConnection(connection);

managerOptions();

/**
 * Function shows main menu for Manager role; based on choice, calls the proper function to execute
 * 
 */
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
    }).then( (response) => {
        // console.log(response);
        switch (response.selectedAction) {
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
                addNewItem();
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

/**
 * Function displays a table of items for sale (plus quantity)
 * 
 */
function viewProducts () {
    let querySQL = 'SELECT item_id, product_name, price, stock_quantity FROM products';
    connection.query(querySQL, (err, res) => {
        if (err) throw err;
        let title = 'LIST OF ALL PRODUCTS FOR SALE';
        common.displayProductTable(title, res); // pass title and queryset to function that will print out information
        console.log('\n');
        managerOptions(); // return to main menu
    });
}

/**
 * Function displays a table of items with stock less than 5
 * 
 */
function viewLowInventory () {
    let querySQL = 'SELECT item_id, product_name, price, stock_quantity FROM products WHERE stock_quantity < 5';
    connection.query(querySQL, (err ,res) => {
        if (err) throw err;
        let title = 'LIST OF PRODUCTS WITH LOW INVENTORY';
        common.displayProductTable(title, res) // pass title and queryset to function that will print out information
        console.log('\n');
        managerOptions(); // return to main menu
    });
}


/**
 * Function prompts to select an item to restock and then asks for the quantituy to add to inventory; then the function updates the database and adds the indicated number to stock
 * 
 */
function addInventory () {
    let inventory = []; // load the array of choices and current inventory
    let querySQL = 'select item_id, product_name, stock_quantity from products';
    connection.query(querySQL, (error ,response) => {
        if (error) throw error;
        for (let i = 0; i < response.length; i ++) {
            let record = {
                name: response[i].product_name,
                value: response[i].item_id
            }
            inventory.push(record);
        }
        // console.log(inventory);
        inquirer.prompt([ // user selects the item and amount to restock
            {
            type: 'list',
            name: 'selectedItem',
            message: 'Choose an item to restock',
            choices: inventory
            }, {
            type: 'input',
            name: 'addQty',
            message: 'Enter the amount to restock',
            validate: (test_value) => { // check for an integer number > 0
                return (/^\d*$/.test(test_value) && test_value > 0) ?  true : 'Enter a whole number greater than zero';
                }
            }
            ]). then ( (answers) => { // update the database
            // console.log(answers);
            let updateSQL = `update products set stock_quantity = stock_quantity + ${answers.addQty} where item_id = ${answers.selectedItem}` // update database
            connection.query(updateSQL, (err) => {
                if (err) throw err;
                console.log ('\nAdded to inventory\n');
                managerOptions(); //return to main menu
            });       
        });
    });
}

/**
 * Function adds a new item to the databse; user is prompted for values that are added to db
 */
function addNewItem() {
    let departments = []; // load the array of choices and current inventory
    let querySQL = 'select department_name from departments';
    connection.query(querySQL, (err, res) => {
        if (err) throw err;
        for (let i = 0; i < res.length; i ++) {
            departments.push(res[i].department_name);
        }
    });
    // insert new item into DB
    inquirer.prompt([  // user enters new item: product_name, department, price, stock_quantity
        {
            type: 'input',
            name: 'newProductName',
            message: 'Enter the new product name'
        },
        {
            type: 'list',
            name: 'newProductDepartment',
            choices: departments,
            message: 'Select the department'
        },
        {
            type: 'input',
            name: 'newProductPrice',
            message: 'Enter the purchase price',
            validate: (testPrice) => { // check for (up to) 2 digit decimal
                return /^\d*(\.?\d{0,2})$/.test(testPrice) && testPrice > 0 ? true : 'Enter a non-negative number, up to 2 decimals';
            }
        },
        {
            type: 'input',
            name: 'newProductQuantity',
            message: 'Enter the initial stock (quantity)',
            validate: (testQuantity) => { // check for an integer number > 0
                return /^\d*$/.test(testQuantity) && testQuantity > 0 ?  true : 'Enter a whole number greater than zero';
            }
        }
    ]).then ( (answers) => {
        let checkUnique = `SELECT * from products where lower(product_name) = '${answers.newProductName.toLowerCase()}'`;
        connection.query(checkUnique, (error, result) => {
            if (error) throw error;
            if (result.length > 0) { // avoid duplicate product
                console.log(`\nThe product ${answers.newProductName} already exists.\n\n`);
                managerOptions(); // return to main menu
            } else { // product name is unique
                let insertSQL = `INSERT into products (product_name, department_name, price, stock_quantity) VALUES ('${answers.newProductName}', '${answers.newProductDepartment}', ${answers.newProductPrice}, ${answers.newProductQuantity})`; //insert new item into database
                connection.query(insertSQL, (err) => {
                    if (err) throw err;
                    console.log(`\nAdded ${answers.newProductQuantity} of ${answers.newProductName} in the ${answers.newProductDepartment} department priced at ${answers.newProductPrice}\n`);
                    managerOptions(); // return to main menu
                });        
            }
        });
    });
}

/**
 * Function closes database connection in preparation of ending program
 */
function exitProgram () {
    console.log ('\nGoodbye.\n');
    common.closeConnection(connection);
}