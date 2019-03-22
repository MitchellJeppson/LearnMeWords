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

app.use(express.static(path.join(__dirname, './')));


app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));

app.post('/processAudio', (req, res) => res.send('Post Hello World!'));

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



app.listen(port, ()=> console.log(`Example app listening on port ${port}!`));
