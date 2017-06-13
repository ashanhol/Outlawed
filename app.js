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
    	session.userData.name = results.response;
        builder.Prompts.text(session, 'Hi ' +  session.userData.name + '! That\'s a cool name. I\'m not sure if you could pronounce my real name, but you can call me Kh\'atyan.');
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
        session.send('Uh.');
        session.send('What the &ast;BODILY SECRETIONS&ast;?');
        session.send('How the &ast;PROCREATIVE ACTIVITY&ast; do you know my name??? Do I know you?');
        builder.Prompts.text(session, 'Where are you from?');
    },
    function (session, results) {
    	if(results.response.toLowerCase().includes('safonia')){
            session.beginDialog('/endSafonia');
        }
        else if(results.response.toLowerCase().includes('lyphia')){
            session.send('What?');
            session.send('I don\'t know anyone named %s', session.userData.name);
            session.send('Seriously, who are you?');
            session.send('Did... did my parents put you up to this? Because you can tell them I\'m not interested. I\'ve made up my mind. ');
            session.endConversation('This was really creepy. Please don’t contact me again.');
        }
        else{
        	session.send('Ok I don\'t know anyone from %s. I don\'t know how you know me but I definitely don\'t know you... ', results.response);
        	session.send('This is really really creepy.');
        	session.endConversation('I\'m leaving now. Please don\'t try to talk to me again?');
        }
    }
]);

bot.dialog('/endSafonia', [
	function (session){
		session.send('Wait, really?');
		builder.Prompts.text(session, 'Uh. Should I know you for any reason?');
	},
	function (session, results) {
		if(results.response.toLowerCase().includes('thea rignomar')){
			session.beginDialog('/thea');
		}
		else{
			session.send('Uh... are you lying to me? ');
			session.send('I\'m sorry, this is really weird. ');
			session.endConversation('I\'m just gonna go now I think.');
		}
	}
]);

bot.dialog('/thea', [
	function (session){
		session.send('Oh my &ast;DEITY&ast;!!!! You know Thea??? ');
		session.send('And she\'s talked about me?? Awwwww.....');
		session.send('Haha this is so weird but I\'m on my way to visit her right now.');
		session.send('We were supposed to meet up next month actually but uh... my parents found out about that. She\'s probably told you a little about them?');
		session.send('Well. I guess "found out" isn\'t really the right word. I kind of... told them. ');
		session.send('Ugh it was so stupid... They were just saying such awful things and I got so mad and I...');
		session.send('I guess I thought I could change their minds, or something. I kept telling myself that it was just how they were raised.');
		session.send('Well, anyway. They didn\'t change their minds. So I\'m coming sooner.');
		session.send('Please don\'t tell Thea about this. I mean I\'ll tell her eventually but I kind of want the first time I see her to just be... happy, you know? ');
		session.send('My parents took the AWG engine out of my ship to stop me from going but who cares!!! I can just do it manually!');
		session.send('Aaaand there we go, got the wormhole open...');
		session.send('&ast;EXCREMENT&ast;. That definitely doesn’t look right. ');
		builder.Prompts.confirm(session, 'Uhhh my spaceship\'s about to enter the wormhole and I don\'t know what to do?? Do you think you can help me? ');		
	},
	function (session, results){
		if(results.response){
			session.beginDialog('/canHelp');
		}
		else{
			session.send('Ok uh... guess we\'ll see what happens then...');
			session.send('If I don\'t make it can you... can you tell Thea what happened? ');
			session.endConversation('I\'m glad I got to meet you, at least.');
		}
	}
]);

bot.dialog('/canHelp', [
	function (session){
		session.userData.problem = Math.floor(Math.random()*3.0);
		session.userData.solution = {'Levers':false, 'Button': false, 'Knob': false}
		session.userData.firstSolution = true;
		session.send('Thank you thank you thank you');
		switch(session.userData.problem){
			case 0:
				session.send('So my engine\'s making a noise like an earthquake and the edges of the wormhole are all wobbly... I have no idea why...');
				break;
			case 1:
				session.send('So my engine\'s making a noise like an earthquake and flashy lights are coming out of the wormhole... I have no idea why...');
				break;
			case 2:
				session.send('So the edges of the wormhole are all wobbly and flashy lights are coming out of it... I have no idea why...');
				break;
		}
		session.send('I\'m in a 20XD6 Staripper, here\'s a blueprint of the engine.');
		session.beginDialog('/fixShip');
	}
]);

bot.dialog('/fixShip', [
	function (session){
		if(session.userData.firstSolution){
			builder.Prompts.choice(session, 'What should I do first?', ['Levers','Button','Knob']);
		}
		else{
			builder.Prompts.choice(session, 'What should I do next?', ['Levers','Button','Knob']);
		}
		
	},
	function(session, results){
		if(results.response.entity== 'Levers'){
			session.beginDialog('/levers');
		}
		else if(results.response.entity== 'Button'){
			session.beginDialog('/button');
		}
		else{
			session.beginDialog('/knob');
		}
	}
]);

bot.dialog('/levers', [
	function(session){
		builder.Prompts.choice(session, 'Which one should I flip?', ['Top','Bottom']);
	},
	function(session, results){
		if(results.response.entity=='Top'){
			//correct lever
			session.userData.solution['Levers']=true;
		}
		session.beginDialog('/checkSolution');
	}
]);

bot.dialog('/button', [
	function(session){
		builder.Prompts.choice(session, 'What mode should it be in?', ['Reserve', 'Charge']);
	},
	function(session, results){
		if(results.response.entity=='Charge'){
			//correct button
			session.userData.solution['Button']=true;
		}

		session.beginDialog('/checkSolution');

	}
]);

bot.dialog('/knob', [
	function(session){
		builder.Prompts.choice(session, 'Which way should I turn it? ', ['Clockwise', 'Counterclockwise']);
	},
	function(session, results){
		if(results.response.entity=='Clockwise'){
			//correct knob
			session.userData.solution['Knob']=true;
		}

		session.beginDialog('/checkSolution');
	}
]);

bot.dialog('/checkSolution', [
	function(session){
		if(!session.userData.firstSolution){
			var correct = false;
			switch(session.userData.problem){
				case 0:
					//Correct solution(earthquake, wobbly): levers top + knob clockwise 
					if(session.userData.solution['Levers'] && session.userData.solution['Knob']){
						correct = true;
					}
					break;
				case 1:
					//Correct solution(earthquake, lights): levers top + button charge
					if(session.userData.solution['Levers']&&session.userData.solution['Button']){
						correct = true;
					}
					break;
				case 2:
					//Correct solution(lights, wobbly): knob clockwise + button charge
					if(session.userData.solution['Knob']&&session.userData.solution['Button']){
						correct = true;
					}
					break;
			}
			if(correct){
				session.beginDialog('/correctSolution');
			}
			else{
				session.beginDialog('/incorrectSolution');
			}
		}
		else{
			session.userData.firstSolution = false;
			session.beginDialog('/incompleteSolution');
		}
	}	
]);

bot.dialog('/incompleteSolution', [
	function(session){
		builder.Prompts.confirm(session, 'Ok, did that. Anything else?');
	},
	function(session, results){
		if(results.response){
			session.beginDialog('/fixShip');
		}
		else{
			session.beginDialog('/incorrectSolution');
		}
	}
]);

bot.dialog('/incorrectSolution', [
	function (session){
		session.send('Well uh');
		session.send('I don\'t think that looks much better actually?? I\'m out of time though...');
		session.send('If I don\'t make it can you... can you tell Thea what happened? ');
		session.endConversation('Thanks for trying, at least.');
	}
]);
bot.dialog('/correctSolution', [
	function (session){
		session.send('Oh thank &ast;DEITY&ast; that looks so much better.');
		session.send('You know how people think if you mess up a wormhole it can take you back in time to when it was created? So you just keep looping through it forever.');
		session.send('lol of course you do, they\'ve only made like a million movies about that. I always wondered if that was true. I guess I almost found out... ');
		session.send('Pretty happy to let it be a mystery forever now! I don’t know what I would\'ve done if you weren\'t here... ');
		session.send('Thank you so much, %s', session.userData.name);
		session.endConversation('I guess I’ll see you soon!!!');
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
            session.beginDialog('/etc', true);

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
    function (session, args) {
        //args distinguishes sending "human" response or "etc" response
        if(args){
            session.send('Oh uh.  Greetings? Ugh, I should have paid attention more in Interspecies Diplomacy...');
            session.send('Humans are really formal right? You have the equivalent "arranged marriages" but no "hookups" outside of that, right? So you kinda get it.');
            builder.Prompts.confirm(session, 'Well whatever you are, you\'re not anti-Safonic are you?');
        }
        else{
            builder.Prompts.confirm(session, 'Oh... I\'ve never heard of you, sorry. You\'re not anti-Safonic, are you?');
        }
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

/*User's species is lyphian*/
bot.dialog('/lyphian', [
	function (session){
		builder.Prompts.choice(session,'Oh no way me too. Where you from?',['Xatse','Sonae','Thonra']);
	},
	function (session, results){
		if(results.response.entity == 'Xatse')
		{
			session.beginDialog('/xatse');
		} 
		else if(results.response.entity == 'Sonae'){
			session.beginDialog('/sonae');
		} 
		else{
			session.beginDialog('/thonra');
		}
	}
]);

bot.dialog('/xatse', [
	function(session){
		session.send('Oh my &ast;DEITY&ast; that\'s awesome!');
		session.send('I\'ve always wanted to go there.');
		session.send('That\'s where they film Outlaws and In-laws right???  You must have seen it right? Have you seen it filmed?');
		session.send('It\'s been banned a bunch where I\'m from for being too "progressive". Some people (like my parents) can\'t handle Lyphian and Safonian relationships. I mean, the Sonae/Safonic wars are SO OVER. I don\'t see what the big deal is.');
		session.send('The episode "My Secret Life" changed everything. It\'s how I bonded with the person I\'m headed off to see. Well, that and an obscure Safonic show I\'m sure you\'ve never heard of. More species should practice the kind of cultural exchange we have. ;D ');
		session.beginDialog('/shipBlueprint', 3);
	}
]);

bot.dialog('/sonae', [
	function(session){
		session.send('Oh. Cool. My parents are from that region. Seems like everyone there is uptight about Safonians, huh?');
		session.send('...');
		session.send('Ok, I\'m sorry, that wasn\'t cool.  I\'ve never been there. I don\'t know how it really is. I\'m sorry if that was insensitive.');
		session.send('I don\'t know how old you were when the Sonae/Safonic war happened...');
		session.send('It really affected my parents. The Outlaw might have been repealed, but its effects are still felt. My parents can\'t see how we as a planet have changed.');
		session.send('The Outlaw banned everything from Safonia so they\'re practically brainwashed with Anti-Safonic propaganda. It\'s kind of funny? In a sad way. We\'re connected with millions of galaxies with so many foreign species, why would you hold so much prejudice against one small group? Especially when they\'re as cool and amazing and well dressed as safoiuqefjk;i;ojaglkd ');
		session.send('Whew ok &ast;sweats&ast;. I\'m just. Going to embarrass myself off the planet now. Bye.');
		session.send('...');
		session.send('Umm');
		session.send('These readings look bad... Guess I was distracted taking off? I think I messed up the AWG engine bypass or something.');
		session.send('I\'m not sure what\'s gonna happen but... it doesn\'t look good...');
		session.endConversation('Thanks for listening to me. My home life was complicated and I really needed to talk to someone about it. ');
	}
]);
bot.dialog('/thonra', [
	function(session){
		session.send('Oh. That\'s interesting, me too. Considering how many galaxies this chat manages to connect, I didn\'t expect to meet someone from the same region as me.');
		session.send('Not sure if you\'re familiar with Vanclor, but I\'m 30 flanktounits snorthweast of that in a small town.');
		builder.Prompts.text(session, 'But anyway. No one really cares about us. You got a favorite show or something? We more or less get the same media as the rest of the Thonra region.');
	},
	function(session, results){
		var oAndI = /outlaws\s?(and|&)\s?in-?\s?laws/i;
		if(oAndI.test(results.response)){
			session.send('Me too!!!! Who\'s your favorite character? Mine\'s Lannery, but my girlfriend likes Kh\'atyan.');
			session.send('Yes I know, my username is Kh\'atyan because of that... so sappy. But honestly, all the characters are perfect. I really can\'t pick, it\'s not fair.');
			session.send('I\'m actually just about to leave Lyphia. I\'m going to see my girlfriend on Safonia for the first time!!!');
			session.send('I\'ll be sure to hit you up once I\'m there, talk later?');
			session.send('Oh no. I thought I bypassed the AWG engine correctly but these readings aren\'t right... ');
			session.send('I don\'t know what\'s about to happen but I don\'t think it will be good.');
			session.send('Can you do me a favor? Like... a last request.');
			session.send('My real name is Nay\'a Ionthae. Can you look up my family and tell them what happened to me? We don\'t have the greatest relationship. They\'re from Sonae so... ya know.');
			session.send('But I still want them to know.');
			session.endConversation('Thanks.');
		}
		else{
			session.send('Huh. I thought I was pretty media savvy but I haven\'t heard of that.');
			session.beginDialog('/shipBlueprint',4);
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

			case 3:
				builder.Prompts.text(session, 'Actually, I\'m headed over to Safonia now. You know anything about space ships?');
				break;
			case 4:
				builder.Prompts.text(session, 'Ok then. You know anything about ships?');
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
	        case 3:
            case 4:
            	session.send('Do you see that square button? That changes the mode of the engine from Reserve to Charge. I think the Reserve Mode is what I need.');
            	session.send('So I\'ll just set that and... ');
            	session.endConversation('Uhhhh I\'m not sure why those flashy lights are coming out of the wormhole that\'s... pretty weird...');
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
            case 3:
            	session.send('Yeah, after the Outlaws and In-laws character... I\'m such a nerd.');
            	session.send('Ok. Maybe juggling taking off and gushing about Outlaws and In-laws wasn\'t the best idea.');
            	session.send('The readings on my ship don\'t look too good...');
            	session.endConversation('...And I was really looking forward to watching the next episode with her once I got there.');
            	break;
            case 4:
            	session.send('So. It\'s been real I guess.');
            	session.send('You managed to catch me at a weird time,  I\'m actually about to leave the planet?');
            	session.send('I should go do that. Bye.');
            	session.send('Well, the readings on my ship don\'t look too good...');
            	session.send('I\'ve. Um. Never been particularly attached to Thonra. I honestly didn\'t think I\'d ever be coming back, but...');
            	session.endConversation('... Well, I hope you have fonder memories of it than I do.');
            	break;
            }
            
        }
    }
]);
