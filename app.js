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
        builder.Prompts.text(session, 'Oh! Hi! I wasn\'t sure if the translation software was working. What\'s your name?');
    },
    function (session, results) {
        builder.Prompts.text(session, 'Hi ' +  results.response + '! That\'s a cool name. I\'m not sure if you could pronounce my real name, but you can call me Kh\'atyan.');
    },
    function (session, results) {
        if(results.response.toLowerCase().includes('nay\'a ionthae')){
            session.beginDialog('/endGame');
        }
        else{
            session.beginDialog('/restOfGame');
        }
    }
]);
//-------------------
/* ENDGAME */
//-------------------
bot.dialog('/endGame', [
    function (session) {
        session.send('This is the endgame');
    }
]);

//-------------------
/*Not endgame*/
//-------------------
bot.dialog('/restOfGame', [
    function (session) {
        builder.Prompts.confirm(session, 'So look. This might be because I\'m talking to a total stranger, '+
        'but I got some things to get off my chest. You cool listening to me vent?');
    },
    function (session, results) {
        console.log(results.response);
        //cool listening to you vent
        if(results.response){
            session.beginDialog('/canVent');
        }
        else{ //not cool w/ vent
            session.beginDialog('/cantVent');
        }
    }
]);

/*Can't vent */
bot.dialog('/cantVent', [
    function (session) {
        session.send('Oh ok that\'s fine. I guess. Well I don\'t know what you wanted to talk about but...');
        session.send('Honestly I should probably be focusing on this anyway.');
        session.send('Bye');
        session.send('...');
        session.send('Crap I know you said you didn\'t want to listen to me but something\'s really wrong with my '+ 
        'spaceship and I\'m pretty scared.');
        builder.Prompts.confirm(session, 'Are you there?');
    },
    function (session, results) {
        //you are there
        if(results.response){
            session.send('Thanks... I\'m getting all these weird readings.');            
            session.send('I think I messed up the manual wormhole generation or something.');
            session.send('I\'m not sure what\'s gonna happen but it looks really bad...');
            session.endConversation('Thanks for being here.');

        }
        else{ //you aren't there
            session.send('Wow, ok. Listen if I\'m about to die');
            session.send('or whatever');
            session.send('Maybe you could try to be like, less of a huge jerk in the future?');
            session.send('Nevermind, it doesn\'t matter I guess.');
            session.endConversation('Goodbye...');
        }
    }
]);

/*Can vent */
bot.dialog('/canVent', [
    function (session) {
        session.send('Oh thank goodness, I thought I was going to explode. So as you know, the Match Alliance Interface ' +
        'was originally an intergalactic matchmaking chat service for interspecies arranged unions, right? Well on my ' + 
        'planet people started using it as an excuse for interplanetary hookups. And my parents JUST found out last night '+
        'that I was planning on going off planet to-  ');
        session.send('Wait. ');
        builder.Prompts.text(session, 'What species are you?');
    },
    function (session, results) {
        //What species are you?
        session.send('A species');
        session.endDialog();        
    }
]);

//-------------------
/*Species*/
//-------------------