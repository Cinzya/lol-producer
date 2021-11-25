const app = require('express')();
const PORT = 8080;
const dummy = require('./dummy.json');

app.listen(
    PORT,
    () => console.log(`Server running on http://localhost:${PORT}`)
)

app.get('/champselect', (req, res) => {
    res.status(200).send(dummy)
});

app.post('/champselect', (req, res) => {
    
})