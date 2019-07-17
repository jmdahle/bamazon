exports.openConnection = function (connection) {
    connection.connect(function(err) {
        if (err) throw err;
        // console.log("Connected as id " + connection.threadId);
    });
}

exports.closeConnection = function (connection) {
    connection.end();
}

exports.rightPad = function (string, len, padchar) {
    len -= string.toString().length;
    let emptyString = padchar.repeat(len);
    let newString = string + emptyString;
    //newString = newString.substring(0, len);
    return newString;
}

exports.leftPad = function (string, len, padchar) {
    len -= string.toString().length;
    let emptyString = padchar.repeat(len);
    let newString = emptyString + string;
    // newString = newString.substring(0, len);
    return newString;
}

/**
* Function prints table of items for sale
* 
* based on sql
* select item_id, product_name, department_name, price, stock_quantity
* from products
* 
* @param {string} title 
* @param {object} res
*/
exports.displayProductTable = function(title, res) {
   let msg = '';
   // console.log(res);
   msg += `\n${title}\n`;
   msg += '='.repeat(title.length);
   msg += '\n';
   msg += exports.rightPad('Item ID', 8, ' ');
   msg += exports.rightPad('Product', 45, ' ');
   msg += exports.leftPad('Quantity', 15, ' ');
   msg += exports.leftPad('Price', 8, ' ');
   msg += '\n';
   msg += exports.rightPad('', 76, '-');
   console.log(msg);
   if (res.length > 0) {
       for (let i = 0; i < res.length; i++) {
           msg = '';
           msg += exports.rightPad(res[i].item_id, 8, ' ');
           msg += exports.rightPad(res[i].product_name, 45, ' ');
           msg += exports.leftPad(res[i].stock_quantity, 15, ' ');
           msg += exports.leftPad(res[i].price.toFixed(2), 8, ' ');
           console.log (msg);
       }
   } else {
       console.log(`No records found`);
   }
}

