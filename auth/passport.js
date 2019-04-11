const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://mjeppson:mjeppson@learnmewords-users-qfbii.mongodb.net/test?retryWrites=true";
const client = new MongoClient(uri, { useNewUrlParser: true});
const conn = client.connect();
const ObjectID = require('mongodb').ObjectID;


passport.serializeUser((user, done) => {
    done(null, user._id);
});

passport.deserializeUser((id, done) => {
    const collection = client.db("LearnMeWordsDB").collection("user_info");
    const query = {_id: ObjectID(id)};
    collection.find(query).toArray((err, user) => {
        done(err, user[0]);
    });
});

passport.use(new LocalStrategy(
    (username, password, done) => {
        const collection = client.db("LearnMeWordsDB").collection("user_info");
        const query = { username: username, password: password};
        collection.find(query).toArray((err, result) => {
            if(err) return done(err);
            if(result.length === 0) return done(null, false);
            done(null, result[0]);
        });
    }
));

module.exports = passport;
