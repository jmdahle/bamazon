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

supervisorOptions()

function supervisorOptions() {
    inquirer.prompt([
        {
            type: 'list',
            name: 'selectedAction',
            message: 'Select an activity',
            choices: [
                {
                    name: 'View Product Sales by Department',
                    value: 'viewSales'
                },
                {
                    name: 'Create New Department',
                    value: 'newDepartment'
                }
            ]
        }
    ]).then ( (answers) => {
        switch (answers.selectedAction) {
            case 'viewSales':
                viewSales();
                break;
            case 'newDepartment':
                newDepartment();
                break;
            default:
                break;
        }
    });
}

function viewSales() {
    sql = 'select departments.department_id, departments.department_name, departments.over_head_costs, sum(products.product_sales) as total_sales, sum(products.product_sales) - over_head_costs as total_profit from departments inner join products on departments.department_name = products.department_name group by department_id;'
    connection.query(sql, (error, dataset) => {
        if (error) throw error;
        let title = 'SALES BY DEPARTMENT';
        displaySalesTable(title, dataset);
        console.log('\n');
        supervisorOptions();
    });
}

function displaySalesTable (title, dataset) {
    let msg = '';
    console.log(dataset);
    msg += `\n${title}\n`;
    msg += '='.repeat(title.length);
    msg += '\n';
    msg += common.rightPad('Dpt_ID', 8, ' ');
    msg += common.rightPad('Department', 20, ' ');
    msg += common.leftPad('Overhead_$', 15, ' ');
    msg += common.leftPad('Sales_$', 15, ' ');
    msg += common.leftPad('Total_$ ', 15, ' ');

    msg += '\n';
    msg += common.rightPad('', 76, '-');
    console.log(msg);
    if (dataset.length > 0) {
        for (let i = 0; i < dataset.length; i++) {
            msg = '';
            msg += common.rightPad(dataset[i].department_id, 8, ' ');
            msg += common.rightPad(dataset[i].department_name, 20, ' ');
            msg += common.leftPad(dataset[i].over_head_costs, 15, ' ');
            msg += common.leftPad(dataset[i].total_sales, 15, ' ');
            msg += common.leftPad(dataset[i].total_profit, 15, ' ');
            console.log (msg);
        }
    } else {
        console.log(`No records found`);
    }

}

function newDepartment() {
    console.log('here');
    inquirer.prompt([
        {
            type: 'input',
            name: 'departmentName',
            message: 'Enter new department name'
        },
        {
            type: 'number',
            name: 'overHeadCosts',
            messsage: 'Enter overhead cost',
            validate: (overHeadCosts) => {
                return !Number.isNaN(overHeadCosts) && overHeadCosts > 0 ? true : 'Enter a number';
            }
        }
    ]).then ( (response) => {
        let sql = `insert into departments ()`;
        console.log (sql);
        console.log(response);
    });
}