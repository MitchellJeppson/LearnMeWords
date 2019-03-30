const express = require('express');
const router = express.Router();
const uniqid = require('uniqid');
const multer = require('multer');
const fs = require('fs'); //use the file system so we can save files
const spawn = require('child_process').spawn;
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/processAudio', upload.single('upl'), function (req, res) {
    let fileName = uniqid()+".wav";
    fs.writeFileSync("./audioFiles/"+fileName, Buffer.from(new Uint8Array(req.file.buffer)));

    const process = spawn('python3', [__dirname+"/handleAudio.py", __dirname+"/audioFiles/"+fileName, req.file.originalname, 'True']);
    let returnedData = [];
    process.stdout.on('data', (data) => {
        let splitData = data.toString('utf8').split(/\r?\n/);
        var filtered = splitData.filter(function (el) {
            return el != "";
        });
        returnedData = returnedData.concat(filtered);
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

module.exports = router;
