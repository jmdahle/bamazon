const inquirer = require('inquirer');
const common = require('./common.js');

const connection = common.createConnection();

supervisorOptions()

/**
 * Function presents main menu of options to Supervisor and calls the proper function based on the selection
 */
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
                },
                {
                    name: 'Exit',
                    value: 'exitProgram'
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
            case 'exitProgram':
                exitProgram();
            default:
                break;
        }
    });
}

/**
 * Function displays departments, overhead, total sales and calculated total net profit
 * 
 */
function viewSales() {
    sql = 'select departments.department_id, departments.department_name, departments.over_head_costs, sum(ifnull(products.product_sales,0)) as total_sales, sum(ifnull(products.product_sales,0)) - over_head_costs as total_profit from departments LEFT join products on departments.department_name = products.department_name group by department_id;'  // ```LEFT``` join permits showing departments with no products; ```INNER``` join would exclude those; ```ifull(columnName,0)``` function replaces ```null``` value from columnName with ```0```
    connection.query(sql, (error, dataset) => {
        if (error) throw error;
        let title = 'SALES BY DEPARTMENT';
        displaySalesTable(title, dataset); // calls function to print queryset
        console.log('\n');
        supervisorOptions();  // back to main menu
    });
}

/**
 * Function prints querset results into a table on the console.
 * 
 * @param {string} title 
 * @param {object} dataset 
 */
function displaySalesTable (title, dataset) {
    let msg = '';
    //console.log(dataset);
    /* Print Headings */
    msg += `\n${title}\n`;
    msg += '='.repeat(title.length);
    msg += '\n';
    msg += common.rightPad('Dpt_ID', 8, ' ');
    msg += common.rightPad('Department', 20, ' ');
    msg += common.leftPad('Overhead_$', 15, ' ');
    msg += common.leftPad('Sales_$', 15, ' ');
    msg += common.leftPad('NetProfit_$ ', 15, ' ');

    msg += '\n';
    msg += common.rightPad('', 76, '-');
    console.log(msg);
    /* Print Body/Table */
    if (dataset.length > 0) {
        for (let i = 0; i < dataset.length; i++) {
            msg = '';
            msg += common.rightPad(dataset[i].department_id, 8, ' ');
            msg += common.rightPad(dataset[i].department_name, 20, ' ');
            msg += common.leftPad(formatNumber(dataset[i].over_head_costs), 15, ' ');
            msg += common.leftPad(formatNumber(dataset[i].total_sales), 15, ' ');
            msg += common.leftPad(formatNumber(dataset[i].total_profit), 15, ' ');
            console.log (msg);
        }
    } else {
        console.log(`No records found`);
    }

}

/**
 * function converts deimal number wtih 2 digigts and thousand's separator ","
 * found at https://blog.abelotech.com/posts/number-currency-formatting-javascript/
 * @decimal {*} num 
 */
function formatNumber(num) {
    return num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
  }
  
/**
 * Function prompts for new department information and inserts a new department into the database
 * 
 */
function newDepartment() {
    inquirer.prompt([
        {
            type: 'input',
            name: 'departmentName',
            message: 'Enter new department name',
            validate: (test_name) => { // check for not null
                    return (test_name.length) ? true : 'NULL not permitted';
                }
        },
        {
            type: 'input',
            name: 'overHeadCosts',
            message: 'Enter overhead cost',
            validate: (testOverhead) => { // check for a (up to) 2 digit decimal
                return /^\d*(\.?\d{0,2})$/.test(testOverhead) ? true : 'Enter a non-negative number, up to 2 decimals';
            }
        }
    ]).then ( (response) => {
        let sql = `insert into departments (department_name, over_head_costs) values ('${response.departmentName}', ${response.overHeadCosts})`;
        // console.log (sql);
        // console.log(response);
        connection.query(sql, (error) => {
            if (error) throw error;
            console.log(`Added new department ${response.departmentName} with overhead costs of ${response.overHeadCosts}.`);
            console.log('\n');
            supervisorOptions();  // return to main menu
        });
    });
}

/**
 * Function closes database connection and exits
 * 
 */
function exitProgram() {
    console.log ('\nGoodbye.\n');
    common.closeConnection(connection);
}