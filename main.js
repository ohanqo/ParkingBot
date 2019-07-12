require('dotenv').config();
const Slackbot = require('slackbots');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());

let numberOfAvailablePlaces = 0;

const params = {
    icon_emoji: ':parking:',
};

const bot = new Slackbot({
    token: process.env.BOT_USER_OAUTH_ACCESS_TOKEN,
    name: 'ParkingBot',
});

bot.on('start', () => {
    app.post('/', function(req, res) {
        const newNumberOfAvailablePlaces = req.body.numberOfAvailablePlaces;
        const average = req.body.avg;
        if (newNumberOfAvailablePlaces !== undefined && newNumberOfAvailablePlaces !== numberOfAvailablePlaces) {
            numberOfAvailablePlaces = newNumberOfAvailablePlaces;
            bot.postMessageToChannel('cars-detector', `Il reste ${numberOfAvailablePlaces} place(s).`, params);
            if (average !== undefined) {
                bot.postMessageToChannel('cars-detector', `Moyenne de ${average}.`, params);
            }
        }
        res.send('Ok');
    });

    app.listen(3000, function() {
        console.log('ParkingBot server listening on port 3000!');
    });
});

bot.on('message', function(data) {
    if (data.type !== 'message' || data.subtype === 'bot_message') {
        return;
    }

    bot.postMessageToChannel('cars-detector', `Hey <@${data.user}>, il reste ${numberOfAvailablePlaces} place(s)`, params);
});
