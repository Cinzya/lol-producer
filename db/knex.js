const knex = require("knex");

const connectedKnex = knex({
    client: "sqlite3",
    connection: {
        filename: "./db/champ_select.sqlite3"
    }
})

module.exports = connectedKnex;