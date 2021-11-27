var express = require("express");
const router = express.Router();

const db = require("./../../db/champ_select");

const cdragon = require("./../cdragon");
const cd = new cdragon();

router.get("/", async (req, res) => {
  const players = await db.getPlayers(req.body);
  res.status(201).json({ players });
});

router.patch("/:id", async (req, res) => {
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

module.exports = router;
