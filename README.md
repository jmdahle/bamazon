# bamazon

## About bamazon
Bamazon is a command-line storefront where customers can view items for sale and purchase them; managers can view inventory, increase inventory, or add items for sale; and supervisors can view a sales summary or add a new department.

Each role - Customer, Manager, and Supervisor - is provided through a separate JavaScript file using Node.js.

See the [demo](LINK TO DEMO)

## Installation
Bamazon relies on Node.js to provide a command line interface to a MySql datbase.

1. [Download](https://nodejs.org/en/download/) and install Node.js
2. [Download](https://dev.mysql.com/downloads/mysql/) and install MySql
3. Create the database using the script ```bamazon.sql``` found in the repository (note this will **erase** any existing bamazon database and populate it with initial values)
4. Use the Node.js package manager - npm - to install the required Node.js packages.  Running ```npm install``` from the command line will install the following Node.js packages:
    * [mysql](https://www.npmjs.com/package/mysql)
    * [inquirer](https://www.npmjs.com/package/inquirer)


## Usage
Bamazon is run from the command line.  The command issued depents on the role - Customer, Manager, or Supervisor.

### Customer role
To use the Customer role, from the command prompt, run ``` node bamazonCustomer.js```.

The Customer is presented with a list of items for sale.  When prompted, the Customer enters the ID of the items to be purchased and the number of items to purchase.  

If the quantity in stock is less than the desired purchase amount, the customer receives a notification and the sale is terminated without being fulfilled.

If there is sufficient quantity to fulfill the order, the inventory is reduced by the number purchased, the total sales for that item is increased, and the Customer is presented with the amount of sale.

### Manager role
To use the Manager role, from the command prompt, run ```node bamazonManager.js```.

The Manager is presented with a menu of choices:
* View product for sale - shows the entire list of items and the current inventory
* View low inventory - shows a list of just those items that have fewer than 5 in inventroy
* Add to inventory - allows the Manager to select a product and indicate how many of item to add into inventory
* Add new product - allows the Manager to add a new product for sale, providing the product name, department, price, and initial stock
* Exit - quits the program and returns to the command prompt

### Supervisor role
The use the Supervisor role, from the command prompt, run ```node bamazonSupervisor.js```.

The Supervisor is presented with a menu of choices:
* View product sales by department - shows a ist of the departments, over head costs, total product sales, and calcaules net profit (sales less overhead)
* Add new department - allows the Supervisor to add a new department (the new department will be available to the Manager for assigning any new products)
* Exit - quits the program and returns to the command prompt


## Technical Notes
* Database functions that are common to all roles are contained in 'common.js' which is exported and included by 'require' in each JavaScript file
* Output is formatted using a "padding" function that formats output to a specified length, using a specified character (e.g., a space ' ' or equal sign '=') to "pad" the text to the proper length.; these functions are also contained in 'common.js' (for left justify or right justify)
* Output for currency values are printed in 2 decimal formal with thousand's separator ","  Source https://blog.abelotech.com/posts/number-currency-formatting-javascript/ (source also in file comments)
* The Customer can enter an invalid ID number.  This is handled through testing the result from query for items in stock returns a null set.
* I filtered the products for sale table for bamazonCustomer.js to only those in stock (if 0 available, it will not show) -- this was not part of the requirements, but seemed reasonable.  If you think prefer not 'skipping' out-of-stock items for sale for any reason (for instance, to extend for 'pre-orders'), the sql statment becomes:
```sql
SELECT item_id, product_name, price FROM products; -- where stock_quantity > 0;
```

## Additional Features
Future development to provide a more robust feature set for this demonstration program might include:
* Modify Customer role to allow the Customer to choose a product from a list rather than entering the product ID
* Modify Customer role to allow the Customer to add items to a 'shopping cart', providing a 'check out' option rather than permit 1 purchase each time run
* Modify Supervisor role to permit changing department overhead; based on the staging of the requirements, a default was needed for any 'pre-existing' departments

## Resources
* All original code as of 7/2019, John Dahle, related to class exercise except where explicitly noted
* Code is found at [GitHub Repository](https://github.com/jmdahle/bamazon)
