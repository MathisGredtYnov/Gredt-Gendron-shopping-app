const express = require('express');
const app = express();
const port = 3000;
const data = require('./data.json');
const cors = require('cors');

//middleware//
app.use(cors());{
    origin: '*'
}

//lancement du serveur//
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}"`);
});