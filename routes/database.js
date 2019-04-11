const express = require('express');
const router = express.Router();
const passport = require('../auth/passport');
const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://mjeppson:mjeppson@learnmewords-users-qfbii.mongodb.net/test?retryWrites=true";
const client = new MongoClient(uri, { useNewUrlParser: true});
const conn = client.connect();
const ObjectID = require('mongodb').ObjectID;


router.post('/createUser', async (req, res) => {
    const collection = client.db("LearnMeWordsDB").collection("user_info");
    const query = { username: req.body.username };
    await collection.find(query).toArray(async (err, result) => {
        if(result.length > 0){
            req.session.message = "Username already taken.";
            res.redirect('/signUp');
        }
        else{
            await collection.insertOne(req.body, (err, response) => {
                if (err) throw err;
                req.session.username = req.body.username;
                res.redirect('/');
            });
        }
    });
});

router.post('/signIn', (req, res, next)=>{
    req.session.message = "";
    passport.authenticate('local', (err, user, info)=>{
        if (err) return next(err);
        if (!user) {
            req.session.message = "Incorrect username or password";
            return res.redirect('/');
        }
        req.logIn(user, function(err){
            if (err) return next(err);
            return res.redirect('/home');
        });
    })(req, res, next);
});

module.exports = router;
