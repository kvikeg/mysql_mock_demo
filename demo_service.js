var mysql = require('mysql');
const util = require('util');

function connect_db(db=null) {
    var params = {
        host: "localhost",
        user: "root",
        password: "sepassword"
    };
    if (db) {
        params.database = db;
    }

    var con = mysql.createConnection(params);

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


async function main_demo() {
    var condb = connect_db("testdb");

    try {

        var sql = "SELECT * from users;"
        console.log("sending a query")
        var res = await condb.query(sql);
        console.log(res);
    } catch(err) {
        console.warn(err);
    } finally {
        await condb.close();
    }
    
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