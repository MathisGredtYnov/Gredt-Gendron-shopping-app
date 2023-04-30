const express = require('express');
const app = express();
const port = 3000;
const data = require('./data.json');
const cors = require('cors');

//middleware//
app.use(cors());{
    origin: '*'
}

//routes//
app.get('/', (req, res) => {
    const pantalons = data;
    res.json(pantalons);
});

app.get('/pantalons', (req, res) => {
    const pantalons = data;
    res.json(pantalons);
});

app.get('/pantalons/Homme', (req, res) => {
    const pantalons = data.Homme.pantalons;
    res.json(pantalons);
});

app.get('/pantalons/Femme', (req, res) => {
    const pantalons = data.Femme.pantalons;
    res.json(pantalons);
});


//lancement du serveur//
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}"`);
});