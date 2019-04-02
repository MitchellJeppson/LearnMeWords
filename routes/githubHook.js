const express = require('express');
const router = express.Router();
var shell = require('shelljs');

const GithubWebHook = require('express-github-webhook');
const webhookHandler = GithubWebHook({ path: '/', secret: 'MitchellJamesJeppson' });

router.use(webhookHandler); // use our middleware

webhookHandler.on('push', function (event, repo, data) {
    shell.exec('git fetch origin master');
    shell.exec('git reset --hard FETCH_HEAD');
    shell.exec('rm -r node_models');
    shell.exec('npm install');
    console.log('Deployment successfull');
});

module.exports = router;
