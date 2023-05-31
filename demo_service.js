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
        var res = await dbcon.query("CREATE DATABASE testdb");
        console.log(res);
    } catch (err) {
        console.error("Failed:" + err);
        return;
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

if (require.main === module) {
    const args = process.argv.slice(2);
    if (args.length > 0 && args[0] == "prepare") {
        await prepare_db();
    } else {
        main_demo();
    }
}

module.exports = {main_demo};