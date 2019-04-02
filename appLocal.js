const https = require("https");
const helmet = require("helmet");
const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

const multer = require('multer');
const fs = require('fs'); //use the file system so we can save files
const spawn = require('child_process').spawn;
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const uniqid = require('uniqid');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb://mjeppson:mitchelljeppson@learnmewords-users-shard-00-00-qfbii.mongodb.net:27017,learnmewords-users-shard-00-01-qfbii.mongodb.net:27017,learnmewords-users-shard-00-02-qfbii.mongodb.net:27017/test?ssl=true&replicaSet=LearnMeWords-Users-shard-0&authSource=admin&retryWrites=true";

const options = {
    key: fs.readFileSync("creds/privkey.pem"),
    cert: fs.readFileSync("creds/fullchain.pem")
};

// app.all('*', (req, res, next) => {
//     if(req.secure){
//         return next();
//     };
//     // res.redirect('https://' + req.host + req.url); // express 3.x
//     res.redirect('https://' + req.hostname + req.url); // express 4.x
// }); // at top of routing calls

//app.use(helmet()); // Add Helmet as a middleware

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});

app.get('/home', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/createUser', (req, res) => {
    console.log(req.body);
    MongoClient.connect(uri, async function(err, client) {
        const collection = client.db("LearnMeWordsDB").collection("user_info");
        await collection.insertOne(req.body, (err, response) => {
            if (err) throw err;
            console.log(response);
            res.json({result: "good"});
            res.end('end');
        });
        client.close();
    });
});

app.post('/signIn', (req, res) => {
    MongoClient.connect(uri, async function(err, client) {
        const collection = client.db("LearnMeWordsDB").collection("user_info");
        var query = { username: req.body.username, password: req.body.password };

        await collection.find(query).toArray(function(err, result) {
            if (err) throw err;
            let found = "";
            if(result.length >  0){
                console.log('found');
                console.log(result);
                found = {result: "good"};
            }
            else{
                console.log('empty');
                console.log(result);
                found = {result: "bad"};
            }
            res.json(found)
            res.end('end');
        });
        client.close();
    });
});

app.get('/signUp', (req, res) => {
    res.sendFile(path.join(__dirname, 'signUp.html'));
});

app.post('/api/test', upload.single('upl'), function (req, res) {
    let fileName = uniqid()+".wav";
    console.log(fileName);
    fs.writeFileSync("./audioFiles/"+fileName, Buffer.from(new Uint8Array(req.file.buffer)));

    console.log(__dirname+"/handleAudio.py");
    console.log(__dirname+"/audioFiles/"+fileName);

    const process = spawn('python3', [__dirname+"/handleAudio.py", __dirname+"/audioFiles/"+fileName, req.file.originalname, 'True']);
    let returnedData = [];
    process.stdout.on('data', (data) => {
        let splitData = data.toString('utf8').split(/\r?\n/);
        var filtered = splitData.filter(function (el) {
            return el != "";
        });
        returnedData = returnedData.concat(filtered);
        console.log(returnedData);
        if(returnedData[2] === "FINISHED"){
            var tryFetch = {userWord: req.file.originalname, understoodWord: returnedData[0], outputMessage: returnedData[1]};
            res.json(tryFetch)
            res.end('end');
        }
    });

    process.stderr.on('data', (err) => {
        console.log('ERROR');
        console.log(err.toString('utf8'));
        var tryFetch = {userWord: req.file.originalname, understoodWord: null, outputMessage: "Google could not understand your word"};
        res.json(tryFetch)
        res.end('end');
    });
});

app.use(express.static(path.join(__dirname, './')));



app.listen(port, ()=> console.log(`LearnMeWords app listening on port ${port}!`));
// https.createServer(options, app).listen(3123, () => console.log(`LearnMeWords secure app listening on port 3123!`));
