const express = require('express');
const fetch = require('node-fetch');
const btoa = require('btoa');
const { catchAsync } = require('../async.js');
const settings = require('../settings.json');
const router = express.Router();

var client_id = settings['id'];
var discord_secret = settings['secret'];
var redirect_uri = encodeURIComponent(settings['redirect']);

// Redirect to discord authentication
router.get('/login', (req, res) => {
    res.redirect(`https://discordapp.com/oauth2/authorize?client_id=${client_id}&scope=identify guilds&response_type=code&redirect_uri=${redirect_uri}`);
});

// When we come back from the discord authentication page
router.get('/callback', catchAsync(async (req, res) => {
    if (!req.query.code) {
        res.send('Error');
        return;
    }

    const code = req.query.code;
    const creds = btoa(`${client_id}:${discord_secret}`);
    const response = await fetch(`https://discordapp.com/api/oauth2/token?grant_type=authorization_code&code=${code}&redirect_uri=${redirect_uri}`, {
        method: 'POST',
        headers: {
            Authorization: `Basic ${creds}`,
        },
    });
    
    const json = await response.json();
    req.session.access_token = `${json.access_token}`;

    if (req.session.server_verify === undefined) {
        res.redirect("/");
    } else {
        res.redirect('/verify/' + req.session.server_verify);
    }
}));

module.exports = router;