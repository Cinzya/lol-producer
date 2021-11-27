var express = require("express");
var app = express();
const PORT = 8080;
const db = require("./../db/champ_select");

const playersRoutes = require("./routes/players");
const picksRoutes = require("./routes/picks");
const bansRoutes = require("./routes/bans");

app.listen(PORT, () =>
  console.log(`Server running on: http://localhost:${PORT}`)
);

app.use(express.json());

app.use("/champselect/players", playersRoutes);
app.use("/champselect/picks", picksRoutes);
app.use("/champselect/bans", bansRoutes);

app.get("/champselect", async (req, res) => {
  const players = await db.getPlayers(req.body);
  const bans = await db.getBans(req.body);
  res.status(201).json({ players, bans });
});
