let http = require('http');
let open = require('open')
let db_reader = require('./db_reader.js')
let renderer = require('./page_render')
let fs = require('fs');
const { networkInterfaces } = require('os');

let render = new renderer 

const creds = JSON.parse(fs.readFileSync("creds.json"));

let db = new db_reader(creds)

function createElement(type, extra, innerHTML){
    return `<${type} ${extra}>${innerHTML}</${type}>`
}

let port = 8080;

const ipA = networkInterfaces().enp0s3[0].address;

console.log(`${ipA}:${port}`);

open("http://localhost:" + port);

dbPromise = db.get_databases()
let databases_list = []
dbPromise.then(value =>{
    databases_list = value
})

http.createServer(function (req, res) {
    console.log(req.url);

    // Request databases
    if (req.url === '/'){
        dbPromise = db.get_databases()
        dbPromise.then(databases => {
            databases_list = databases
            res.write(
                createElement("div", "id='databases'", 
                    render.databases(databases)
                )
            );
            res.end();
        })
    }
    else{
        switch (req.url.split('/').length) {
            case 2:
                dbPromise = db.get_databases()
                dbPromise.then(databases => {
                    // Check if database exists
                    if (databases.includes(req.url.split('/')[1])){
                        db.set_database(req.url.split('/')[1])
                        tablesPromise = db.get_tables()
                        tablesPromise.then(tables => {
                            res.end(
                                createElement("a", "href='/'", 
                                    createElement("p", "", "Back...")  
                                ) +
                                createElement("div", "id='tables'",
                                    render.tables(req.url.split('/')[1] ,tables)
                                )
                            );
                        })
                    }
                    // Database doesn't exist
                    else {
                        res.end(
                            createElement("a", "href='/'", 
                                createElement("p", "", "Back...")    
                            ) +
                            createElement("p", "", 
                                `The ${req.url.split('/')[1]} database doesn't exist!`
                            )
                        )
                    }
                })
                break;

            case 3:
                dbPromise = db.get_databases()
                dbPromise.then(databases => {
                    // Check if database exists
                    if (databases.includes(req.url.split('/')[1])){
                        db.set_database(req.url.split('/')[1])
                        tablesPromise = db.get_tables()
                        tablesPromise.then(tables => {
                            // Check if table exists
                            if (tables.includes(req.url.split('/')[2])){
                                elementsPromise = db.get_all_records(req.url.split('/')[2])
                                elementsPromise.then(records => {
                                    res.end(
                                        `<style>
                                            table, th, td {
                                            border:1px solid black;
                                            }
                                        </style>` +
                                        createElement("a", `href='/${req.url.split('/')[1]}'`,
                                            createElement("p", "",
                                                "Back..."
                                            )
                                        ) +
                                        createElement("div", "", 
                                            render.records(records[0], records[1])
                                        )
                                    )
                                })
                            }
                            // Table doesn't exist
                            else{
                                res.end(
                                    createElement("a", "href='/'", 
                                        createElement("p", "", "Back...")    
                                    ) +
                                    createElement("p", "", 
                                        `The ${req.url.split('/')[2]} table doesn't 
                                        exist in the ${req.url.split('/')[1]} database!`
                                    )
                                )
                            }
                        })
                    }
                    // Database doesn't exist
                    else {
                        res.end(
                            createElement("a", "href='/'", 
                                createElement("p", "", "Back...")    
                            ) +
                            createElement("p", "", 
                                `The ${req.url.split('/')[1]} database doesn't exist!`
                            )
                        )
                    }
                })
                break;
            default:
                res.end(
                    createElement("p", "",
                        "Page not found!"
                    )
                )
        }
    }
}).listen(port); 
