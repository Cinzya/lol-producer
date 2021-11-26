const app = require('express')();
const PORT = 8080;
const db = require("./../db/champ_select");

app.listen(
    PORT,
    () => console.log(`Server running on: http://localhost:${PORT}`)
)

app.get('/champselect', async (req, res) => {
    const players = await db.getPlayers(req.body);
    const bans = await db.getBans(req.body);
    res.status(201).json({ players, bans });
});

app.get('/champselect/players', async (req, res) => {
    const players = await db.getPlayers(req.body);
    res.status(201).json({ players });
});

app.get('/champselect/bans', async (req, res) => {
    const bans = await db.getBans(req.body);
    res.status(201).json({ bans });
});

app.post('/champselect/player/:id', (req, res) => {
    
})