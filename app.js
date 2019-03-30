const https = require("https");
const helmet = require("helmet");
const express = require('express');
const path = require('path');
const app = express();
const port = 3000;
const fs = require('fs');

const bodyParser = require('body-parser');
const githubHook = require('./routes/githubHook');
const mongoDatabase = require('./routes/database');
const processAudio = require('./routes/processAudio');

app.all('*', (req, res, next) => {
    if(req.secure){
        return next();
    };
    res.redirect('https://' + req.hostname + req.url); // express 4.x
});

app.use(helmet()); // Add Helmet as a middleware

app.use(bodyParser.json());

app.use('/githubHook', githubHook);
app.use('/db', mongoDatabase);
app.use('./processAudio', processAudio);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});

app.get('/home', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/signUp', (req, res) => {
    res.sendFile(path.join(__dirname, 'signUp.html'));
});

app.use(express.static(path.join(__dirname, './')));

const options = {
    key: fs.readFileSync("creds/privkey.pem"),
    cert: fs.readFileSync("creds/fullchain.pem")
};

app.listen(port, ()=> console.log(`LearnMeWords app listening on port ${port}!`));
https.createServer(options, app).listen(3123, () => console.log(`LearnMeWords secure app listening on port 3123!`));
