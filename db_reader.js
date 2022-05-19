let mysql = require('mysql')

class db_reader{

    constructor(creds, database=""){
        this.creds = creds
        if (database===""){
            this.connection = mysql.createConnection({
                host: creds.host,
                user: creds.username,
                password: creds.password
            });
        } else{
            this.connection = mysql.createConnection({
                host: creds.host,
                user: creds.username,
                password: creds.password,
                database: database
            });
        }
    }

    set_database(database){
        this.connection = mysql.createConnection({
            host: this.creds.host,
            user: this.creds.username,
            password: this.creds.password,
            database: database
        });
    }

    create_database(db_name){
        const sql = "CREATE DATABASE " + db_name
        this.do_query(sql)
    }

    get_databases(){
        const sql = "SHOW DATABASES"
        return this.create_query_promise(sql)
    }

    get_tables(){
        const sql = "SHOW TABLES";
        return this.create_query_promise(sql)
    }

    /** Returns a promise with an array:
     * [0] = keys of the records
     * [1] = records
     *  */ 
    get_all_records(table){
        const sql = "SELECT * FROM " + table;
        return new Promise((resolve, rejects) => {
            this.connection.query(sql, function (err, result) {
                if (err) rejects(err);
                resolve([get_keys(result), result.reverse()])
            })
        }); 
    }

    create_query_promise(sql){
        return new Promise((resolve, rejects) => {
            this.connection.query(sql, function (err, result) {
                if (err) rejects(err);
                resolve(create_array_from_sql_result(result) )
            })
        }); 
    }

    do_query(sql){
        this.connection.query(sql, function (err, result) {
            if (err) throw(err);
            console.log("Executed sql: " + sql + " with result: " + result);
        })
    }

}

function create_array_from_sql_result(sqlResult){
    let retArray = []
    for (i in sqlResult){
        retArray.push(Object.values(sqlResult[i])[0])
    }
    return retArray
}


const get_keys = (records) => {
    let keys = []
    for (let key in records[0]){
        keys.push(key)
    }
    return keys
}

module.exports = db_reader
