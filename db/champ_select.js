const knex = require("./knex");

function getPlayers() {
  return knex
    .select(
      "players.name",
      "picks.splashart_original",
      "picks.splashart_centered",
      "picks.tile",
      "picks.portrait"
    )
    .from("players")
    .leftJoin("picks", "players.id", "picks.player");
}

function getBans() {
  return knex("bans").select(
    "name",
    "splashart_original",
    "splashart_centered",
    "tile",
    "portrait"
  );
}

async function updatePlayer(id, data) {
  return knex("players").where("id", id).update(data);
}

async function updateBan(id, data) {
  return knex("bans").where("id", id).update({
    data,
  });
}

async function updateBanTurn(turn, data) {
  return knex("bans").where("pickTurn", turn).update({
    data,
  });
}

async function updatePick(id, data) {
  return knex("picks").where("id", id).update({
    data,
  });
}

async function updatePickTurn(turn, data) {
  return knex("picks").where("pickTurn", turn).update({
    data,
  });
}

function clearPlayers() {
  return knex("players").update({ name: "" });
}

function clearBans() {
  return knex("bans").update({ ban: "" });
}

function clearPicks() {}

module.exports = {
  getPlayers,
  getBans,
  updatePlayer,
  updateBan,
  updateBanTurn,
  updatePick,
  updatePickTurn,
  clearPlayers,
  clearBans,
};
