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

app.get('/pantalons/:id', (req, res) => {
    const id = req.params.id;
    const pantalons = data.Homme.pantalons;
    const pantalon = pantalons.find(pantalon => pantalon.id == id);
    if (!pantalons){
        res.status(404).send('Pantalon not found');
    } else {
        res.status(200).json(pantalon);
        message = 'Pantalon found'
        pantalons = pantalon;
    }
});


//lancement du serveur//
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}"`);
});