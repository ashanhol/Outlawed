var restify = require('restify');
var builder = require('botbuilder');

//=========================================================
// Bot Setup
//=========================================================

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url); 
});

// Create chat connector for communicating with the Bot Framework Service
var connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});

// Listen for messages from users 
server.post('/api/messages', connector.listen());
var bot = new builder.UniversalBot(connector);


//=========================================================
// Bots Dialogs
//=========================================================


/* Beginning of the game dialog */
bot.dialog('/', [
    function (session, results) {
        session.send('Hello?');
        builder.Prompts.text(session, 'Oh! Hi! I wasn\'t sure if the translation software was working. What\'s your name?');
    },
    function (session, results) {
        builder.Prompts.text(session, 'Hi ' +  results.response + '! That\'s a cool name. I\'m not sure if you could pronounce my real name, but you can call me Kh\'atyan.');
    },
    function (session, results) {
        if(results.response.toLowerCase().includes('nay\'a ionthae')){
            session.beginDialog('/endGame');
            session.endDialog();
        }
        else{
            session.beginDialog('/restOfGame');
            session.endDialog();
        }

    }
]);


/* ENDGAME */
bot.dialog('/endGame', [
    function (session) {
        session.send('This is the endgame');
    }
]);

bot.dialog('/restOfGame', [
    function (session) {
        builder.Prompts.text(session, 'This is the rest of game');
    },
    function (session, results) {
        session.endDialogWithResult(results);
    }
]);