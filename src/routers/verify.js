const express = require('express');
const reCAPTCHA = require('recaptcha2');
const fetch = require('node-fetch');
const btoa = require('btoa');
const { catchAsync } = require('../async.js');
const router = express.Router();
const settings = require('../settings.json');

var recaptcha = new reCAPTCHA({
    siteKey: settings['recaptcha-key'],
    secretKey: settings['recaptcha-secret']
});

var client_id = settings['id'];
var discord_secret = settings['secret'];
var creds = btoa(`${client_id}:${discord_secret}`);

router.get('/:serverId', catchAsync(async(req, res) => {
    res.render('verify', {
        layout: "verify",
        title: 'Verification',
        serverId: 'This is a server ID',
        serverName: 'Verify your account on FadeCloud',
        serverIcon: '/static/fade.png'
    });
}));

router.post('/submit', catchAsync(async (req, res) => {
    // Disable while testing, makes it a lot faster
    // try {
    //     await recaptcha.validateRequest(req);
    // } catch (error) {
    //     res.json({error: "Captcha was not completed."});
    //     return;
    // }

    const user = await getData(ENDPOINT_USER, req.session.access_token);
    const servers = await getData(ENDPOINT_GUILDS, req.session.access_token);
    const serverID = req.body['serverID'];
    if (user.code === undefined && servers.code === undefined && serverID != undefined) {
        var server = getServer(servers, serverID);

        if (server === undefined) {
            res.json({error: "You are not in the server you attempted to verify."});
        } else {
            res.json(server);
        }
    } else {
        res.json({error: "Invalid request."});
    }

}));

var getData = async (endpoint, token) => {
    const response = await fetch(API_URL_BASE + endpoint, {
        method: 'GET',
        headers: { Authorization: 'Bearer ' + token }
    });

    const json = await response.json();
    return json;
}

var getServer = (servers, serverID) => {
    var server;
    for (var i = 0; i < servers.length; i++) {
        if (servers[i]['id'] === serverID) {
            server = servers[i];
            break;
        }
    }

    return server;
}

module.exports = router;