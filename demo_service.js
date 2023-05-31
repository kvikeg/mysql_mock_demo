var mysql = require('mysql');
const util = require('util');

function connect_db() {
    var con = mysql.createConnection(
        {
            host: "localhost",
            user: "root",
            password: "sepassword"
        }
    );

    return {
        query(sql, args) {
            return util.promisify(con.query).call(con, sql, args);
        },
        close(sql) {
            return util.promisify(con.end).call(con);
        }
    };
}

async function prepare_db() {
    console.log("Preparing DB");
    var dbcon = connect_db()
    try {
        
        try {
            var res = await dbcon.query("CREATE DATABASE testdb;");
            console.log(res);
        } catch (err) {
            var strerr = err.toString();
            if (strerr.indexOf("ER_DB_CREATE_EXISTS") !== -1) {
                console.log("The database already exists");
            } else {
                console.error("Failed:" + err);
                return;
            }
        }

        try {
            var res = await dbcon.query("use testdb;");
            console.log(res);
            var sql = "CREATE TABLE users (name VARCHAR(255), address VARCHAR(255))";
            res = await dbcon.query(sql);
            console.log(res);
        } catch (err) {
            var strerr = err.toString();
            if (strerr.indexOf("ER_TABLE_EXISTS_ERROR") !== -1) {
                console.log("The table already exists");
            } else {
                console.error("Failed:" + err);
                return;
            }
        }
    
    } finally {
        await dbcon.close();
    }
}


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
        });
        
        con.end(function(err) {
            if (err) throw err;
            console.log('Connection ended');
        });
    });
    
}

async function main() {

    if (require.main === module) {
        const args = process.argv.slice(2);
        if (args.length > 0 && args[0] == "prepare") {
            await prepare_db();
        } else {
            main_demo();
        }
    }
}

main();

module.exports = {main_demo};