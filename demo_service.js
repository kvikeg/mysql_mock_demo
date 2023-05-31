var mysql = require('mysql');

function main_demo() {
    var con = mysql.createConnection(
        {
        host: "localhost",
        user: "root",
        password: "sepassword"
    }
    );
    
    con.connect(function(err) {
        if (err) throw err;
        console.log("Connected");
        
        var sql = "SELECT * from users;"
        
        con.query(sql, function (err, result) {
            if (err) throw err;

            if (result.length == 0) {
                console.error("Error getting users");
            } else {
                console.log("Result: " + JSON.stringify(result));
            }
        });
        
        con.end(function(err) {
            if (err) throw err;
            console.log('Connection ended');
        });
    });
    
}


module.exports = {main_demo};