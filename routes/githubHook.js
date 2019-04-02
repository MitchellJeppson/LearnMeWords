const express = require('express');
const router = express.Router();

const GithubWebHook = require('express-github-webhook');
const webhookHandler = GithubWebHook({ path: '/', secret: 'MitchellJamesJeppson' });

router.use(webhookHandler); // use our middleware

webhookHandler.on('push', function (event, repo, data) {
    console.log(event);
});

module.exports = router;
