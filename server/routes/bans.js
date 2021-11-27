var express = require("express");
const router = express.Router();

const db = require("./../../db/champ_select");

const cdragon = require("./../cdragon");
const cd = new cdragon();

router.get("/", async (req, res) => {
  const bans = await db.getBans(req.body);
  res.status(201).json({ bans });
});

router.patch("/:id", async (req, res) => {
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

module.exports = router;
