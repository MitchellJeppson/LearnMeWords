const express = require('express');
const router = express.Router();
const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb://mjeppson:mitchelljeppson@learnmewords-users-shard-00-00-qfbii.mongodb.net:27017,learnmewords-users-shard-00-01-qfbii.mongodb.net:27017,learnmewords-users-shard-00-02-qfbii.mongodb.net:27017/test?ssl=true&replicaSet=LearnMeWords-Users-shard-0&authSource=admin&retryWrites=true";


router.post('/createUser', (req, res) => {
    MongoClient.connect(uri, async function(err, client) {
        const collection = client.db("LearnMeWordsDB").collection("user_info");
        await collection.insertOne(req.body, (err, response) => {
            if (err) throw err;
            res.json({result: "good"});
            res.end('end');
        });
        client.close();
    });
});

router.post('/signIn', (req, res) => {
    MongoClient.connect(uri, async function(err, client) {
        const collection = client.db("LearnMeWordsDB").collection("user_info");
        var query = { username: req.body.username, password: req.body.password };

        await collection.find(query).toArray(function(err, result) {
            if (err) throw err;
            let found = "";
            if(result.length >  0){
                found = {result: "good"};
            }
            else{
                found = {result: "bad"};
            }
            res.json(found)
            res.end('end');
        });
        client.close();
    });
});

module.exports = router;
