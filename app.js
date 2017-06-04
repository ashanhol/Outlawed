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
        if(results.response.toLowerCase().includes('lyphian')){
            session.beginDialog('/lyphian');
        }
        else if(results.response.toLowerCase().includes('safonian')){
            session.beginDialog('/safonian');

        }
        else if(results.response.toLowerCase().includes('human')){
            session.beginDialog('/human');

        }
        else{
            session.beginDialog('/etc');
        }
    }
]);

//-------------------
/*Species*/
//-------------------
/*User answers not lyphian, safonian, or human */
bot.dialog('/etc', [
    function (session) {
        builder.Prompts.confirm(session, 'Oh... I\'ve never heard of you, sorry. You\'re not anti-Safonic, are you?');
    },
    function (session, results) {
        //space homophobic
        if(results.response){
            session.beginDialog('/antisafonic');
        }
        else{ //tolerant
            session.send('Cool. I\'ve had enough trouble with my stupid Lyphian family anyway. '+
            'Ugh older Lyphians are so old school. My dumb parents found out that I\'m on my way to '+
            'meet a Safonian through the Match Alliance Interface and disabled my ship\'s Automatic Wormhole Generator.');
            session.beginDialog('/shipBlueprint', 1); //to to ship blueprint
        }
    }
]);

bot.dialog('/safonian', [
    function (session) {
        session.send('Oh really????? Haha no way, I\'m on my way to meet a Safonian right now. I mean that\'s why '+
        'I\'m in this mess in the first place, we were bonding over the show Glitz and ');
        session.send('Wait isn\'t it on now? How could you be missing the weekly viewing? ');
        session.send(' Oh uh, I mean.');
        session.send('I\'m sorry that was really uncool of me. I guess I should have realized not all Safonians ' +
        'are into the same things. I mean I know some prefer Space Flannel and like some like Space Makeup...  ');
        session.send('Ok I\'m just going to stop before I embarrass myself more.');
        session.beginDialog('/shipBlueprint', 2); //to to ship blueprint

    }
]);

//space homophobic
bot.dialog('/antisafonic', [
    function (session) {
        session.send('Oh ok well. Bye, I guess.');
        session.send('...');
        session.send('Oh my &ast;GENTLY CARESS&ast;');
        builder.Prompts.confirm(session, 'Are you still here?');
    },
    function (session, results) {
        //are here
        if(results.response){
            session.send('Oh cool.');
            session.send('Well something\'s wrong with my ship and');
            session.send('Not sure why I\'m telling you about this.');
            session.send('Listen if I\'m about to die, or whatever. Maybe you could try to be like, less of a hateful person in the future?');
            session.send('In my honor?');
            session.send('Nevermind, it doesn\'t matter I guess');          
            session.endConversation('Goodbye.');
        }
        else{ //aren't here
            session.send('Wow uh');
            session.send('No need to be a &ast;GENITAL&ast; about it.');
            session.send('I just...');
            session.send('Something\'s wrong with my ship and ');
            session.send('I don\'t know why I\'m telling you this. Kinda wish I wasn\'t spending my last minutes talking to a total &ast;VULGAR BODY DESCRIPTION&ast;!!');
            session.send('I\'m just gonna.');
            session.endConversation('Goodbye.');

        }
      
    }
]);

//-------------------
/*Blueprint*/
//-------------------
/*Space blueprint function. Different dialog depending on which route- pass through args */
bot.dialog('/shipBlueprint', [
    function (session, args) {
        //args will let us know which of the blueprint dialogs we're on.
        session.dialogData.blueprintThread = args; 
        switch(session.dialogData.blueprintThread){
            case 1:
                session.send('Lucky for me, there\'s nothing stopping me from doing it manually! I looked up on the '+
                '&ast;INTERGALACTIC LATTICE&ast; (GALAT) how to bypass the AWG Engine to rip my own Wormhole.')
                builder.Prompts.text(session, 'Where are my manners, I\'ve been rambling on about space mechanics and never asked if you\'re into ships!');
                break;
            case 2: 
                builder.Prompts.text(session, 'AAAAANyway do you know anything about space ships?');
                break;

        }
    }, 
    function(session, results){
        //knows ship name
        if(results.response.toLowerCase().includes('20xd6 staripper')){
            session.send('Oh wow that\'s what I\'ve got here. It\'s cool to meet a fellow enthusiast. Here\'s the blueprint for what I\'m looking at.');
            //TODO: PUT BLUEPRINT PIC IN
            switch(session.dialogData.blueprintThread){
            case 1:
                session.send('You see the X-like thing? Those are levers. Right now it\'s set to direct the '+
                'Ytterbium into the AWG, but if I flip the bottom switch, it will redirect it... ');
                session.send('Got it! Yes! I felt the engine spark to life! I\'m opening a wormhole now... ');
                session.endConversation('Oh no. That wasn\'t a spark. More like a quake...');
                break;
            case 2: 
                session.send('Do you see the circle thing? It\'s a knob that transfers power from the thrusters '+
                'into the Wormhole Stability Matrix. If I just turn it counter-clockwise... ');
                session.send('Ok awesome, I see it opening!');
                session.send('Wait...That doesn\'t look like it normally does.');
                session.endConversation('The edges of the wormhole are all wobbly?');
                break;
            }
        }
        else{ //doesn't know ship name
            session.send('Haha it\'s cool if you don\'t actually know much about ships. My ship here is a 20XD6 Staripper. But I named her Lannery.');
            switch(session.dialogData.blueprintThread){
                case 1: 
                    session.send('My parents tried to stop me but I\'m too smart for them! I actually want to be a mechanic someday.');
                    session.send('Ok, I made the changes. Should\'ve fixed the ship, time to take off! Wish me luck!');
                    session.send('...');
                    session.send('Oh no. Oh &ast;EXCREMENT.&ast;');
                    session.endConversation('I hate to admit it, but uh. I can\'t figure out these readings. I messed up the bypass somehow? This looks bad... ');
                    break;
                case 2: 
                    session.send('&ast;EXCREMENT.&ast;, something\'s going wrong with my ship.');
                    session.send('Could you do me a favor? Could you try and find Thea Rignomar and uh. Tell her I\'m sorry. I\'m sorry I couldn\'t make it.');
                    session.send('Thanks. I know Safonia is a big planet but. She meant a lot to me.');
                    session.endConversation('You seem cool. If only we had more time to talk...');
                    break;
            }
        }
    }
]);