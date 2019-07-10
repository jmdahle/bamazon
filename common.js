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
