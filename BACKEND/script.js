const express = require('express');
const app = express();
const port = 3000;
const data = require('./data.json');
const cors = require('cors');

//middleware//
app.use(cors());{
    origin: '*'
}

//make a list of pantalons//
function GetPantalonsListe() {
    let pantalon_liste;
    pantalon_liste = data.Homme.pantalons.concat(data.Femme.pantalons);
    return pantalon_liste;
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

app.get('/pantalon/:id', (req, res) => {
    let pantalons = GetPantalonsListe();
    let id = req.params.id;
    id = Number(id)
    let pantalon = pantalons.find(pantalon => pantalon.id === id);
    res.json(pantalon);
});

//lancement du serveur//
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}"`);
});