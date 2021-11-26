const knex = require("./knex");

function getPlayers() {
    return knex.select("players.name as player", "roles.name as role", "players.pick").from("players")
    .leftJoin("roles", "roles.id", "players.role");
}

function getBans() {
    return knex("bans")
}



module.exports = {
    getPlayers,
    getBans
}