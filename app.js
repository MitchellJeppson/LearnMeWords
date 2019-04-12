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
const passport = require('./auth/passport');

const isProd = require("os").userInfo().username === "bitnami";

const session = require('express-session');

if(isProd){
    app.all('*', (req, res, next) => {
        if(req.secure){
            return next();
        };
        res.redirect('https://' + req.hostname + req.url);
    });

    app.use(helmet());
}

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');

app.use(session({ secret: "mitchelljeppson", resave: false, saveUninitialized: false}));
app.use(bodyParser.urlencoded({extended: false}));
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.json());
app.use('/githubHook', githubHook);
app.use('/db', mongoDatabase);
app.use('./processAudio', processAudio);

app.get('/', (req, res) => {
    req.logout();
    res.render('login.ejs', {message: req.session.message, username: req.session.username});
});

app.get('/home', /*ensureAuthenticated,*/ (req, res) => {
    res.render('index.ejs');
});

app.get('/signUp', (req, res) => {
    req.logout();
    res.render('signUp.ejs', {message: req.session.message});
});

app.get('/highscores', /*ensureAuthenticated,*/ (req, res) => {
    res.render('highscores.ejs');
});

app.use(express.static(path.join(__dirname, './')));



app.listen(port, ()=> console.log(`LearnMeWords app listening on port ${port}!`));
if(isProd){
    const options = {
        key: fs.readFileSync("creds/privkey.pem"),
        cert: fs.readFileSync("creds/fullchain.pem")
    };

    https.createServer(options, app).listen(3123, () => console.log(`LearnMeWords secure app listening on port 3123!`));
}

function ensureAuthenticated(req, res, next){
    if(req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
}
