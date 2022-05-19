function createElement(type, extra, innerHTML){
    return `<${type} ${extra}>${innerHTML}</${type}>`
}
class render{
    constructor(){

    }
    databases(database_list){
        let ret_string = ""
        for (let i in database_list){
            let db_name = database_list[i]
            ret_string += `<a href=/${db_name}>${db_name}</a> <br>`
        }
        return ret_string
    }
    tables(database_name, tables_list){
        let ret_string = ""
        for (let i in tables_list){
            let table_name = tables_list[i]
            ret_string += `<a href=/${database_name}/${table_name}>${table_name}</a> <br>`
        }
        return ret_string
    }
    records(keys, records){
        let ret_string = createElement("table", "", 
            createElement("tr", "", 
                html_keys(keys)
            ) +
            html_records(records, keys)
        )
        return ret_string
    }
}

function html_keys(keys){
    ret = ""
    for (let key in keys){
        ret += createElement("th", "", 
            keys[key]
        )
    }
    return ret
}

function html_records(records, keys){
    ret = ""
    for (let i in records){
        ret += "<tr>"
        for (let key in keys){
            ret += createElement("td", "",
                records[i][keys[key]]
            )
        }
        ret += "</tr>"
    }
    return ret
}

module.exports = render