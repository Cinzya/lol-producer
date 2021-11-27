var express = require("express");
var app = express();
const PORT = 8080;
const db = require("./../db/champ_select");

const cdragon = require("./cdragon");
const cd = new cdragon();

app.listen(PORT, () =>
  console.log(`Server running on: http://localhost:${PORT}`)
);

app.use(express.json());

app.get("/champselect", async (req, res) => {
  const players = await db.getPlayers(req.body);
  const bans = await db.getBans(req.body);
  res.status(201).json({ players, bans });
});

app.get("/champselect/players", async (req, res) => {
  const players = await db.getPlayers(req.body);
  res.status(201).json({ players });
});

app.get("/champselect/bans", async (req, res) => {
  const bans = await db.getBans(req.body);
  res.status(201).json({ bans });
});

app.patch("/champselect/player/:id", async (req, res) => {
  var { spell1, spell2 } = req.body;
  spell1 = await cd.spell(spell1);
  spell2 = await cd.spell(spell2);

  const player = await db.updatePlayer(req.params.id, {
    name: req.body.name,
    spell1: spell1.name,
    spell1_icon: spell1.iconPath,
    spell2: spell2.name,
    spell2_icon: spell2.iconPath,
  });
  res.status(200).json({ player });
});

app.patch("/champselect/pick/:id", async (req, res) => {
  const { championKey } = res.body;

  const splashart_original = await cd.img(championKey, "splashart_original");
  const splashart_centered = await cd.img(championKey, "splashart_centered");
  const tile = await cd.img(championKey, "tile");
  const portrait = await cd.img(championKey, "portrait");
  const name = await cd.champion(championKey).name;

  const id = db.updatePickTurn(req.params.id, {
    championKey: championKey,
    name: name,
    splashart_original: splashart_original,
    splashart_centered: splashart_centered,
    tile: tile,
    portrait: portrait,
  });
  res.status(200).json({ id });
});

app.patch("/champselect/ban/:id", async (req, res) => {
  const { championKey } = res.body;

  const splashart_original = await cd.img(championKey, "splashart_original");
  const splashart_centered = await cd.img(championKey, "splashart_centered");
  const tile = await cd.img(championKey, "tile");
  const portrait = await cd.img(championKey, "portrait");
  const name = await cd.champion(championKey).name;

  const id = db.updateBanTurn(req.params.id, {
    championKey: championKey,
    name: name,
    splashart_original: splashart_original,
    splashart_centered: splashart_centered,
    tile: tile,
    portrait: portrait,
  });
  res.status(200).json({ id });
});
