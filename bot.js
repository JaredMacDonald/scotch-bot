const schedule = require('node-schedule');

if (!process.env.token) {
  process.exit(1);
}

const Botkit = require('botkit');
const http = require("http");

const useKeepAlive = process.env.useKeepAlive;

const controller = Botkit.slackbot({
  debug: true,
  json_file_store: './db_slack_bot/'
});

var bot = controller.spawn({
  token: process.env.token
}).startRTM();

// fetch and store team information
bot.api.team.info({}, function (err, res) {
  if (err) {
    return console.error(err)
  }

  controller.storage.teams.save({id: res.team.id}, (err) => {
    if (err) {
      console.error(err)
    }
  })
})

//prepare the webhook
controller.setupWebserver(process.env.PORT || 3001, function(err, webserver) {
  controller.createWebhookEndpoints(webserver, bot, function() {
      // handle errors...
  });
});
if(useKeepAlive === true) {
  setInterval(function() {
      http.get("http://scotch-bot.herokuapp.com");
  }, 900000); // every 15 minutes (900000) 
}

var rule = new schedule.RecurrenceRule();
rule.dayOfWeek = 6;
rule.hour = 14;
rule.minute = 0;

var job = schedule.scheduleJob(rule, () => {
  bot.say({ 
    text: "<!channel> Happy :scotch: day everyone!  Don't forget to bring your :moneybag:!",
    channel: 'C65F14Q92' 
  });
})

// here starts the action ---
controller.on('slash_command', (bot, message) => {
   // Validate Slack verify token
  //  if (message.token !== VERIFY_TOKEN) {
  //   return bot.res.send(401, 'Unauthorized')
  // }

  switch (message.command) {
    case '/scotchbotsay':
      var whatToSay = message.match[1];
      if(whatToSay != null || whatToSay != undefined ) 
      {
        bot.reply(message, message.match[1])
      }
      break
    default:
      bot.replyPrivate(message, "Sorry, I'm not sure what that command is")
  }
})

controller.on('member_joined_channel', function(bot, message)
{
    var user = message['user'];
    
    bot.reply(message, 'Welcome to the Scotch Club channel <@${user}>')
});

const { hears, storage: { channels } } = controller;

function rulesPrivateConversation(bot, message)
{
  const {user} = message;

  return (err, convo) => 
  {
    if(err) throw err;

    convo.say(printRules());
  }
}

function printRules() {
  return {
    "text": 'The *SIS Scotch Club* has the following rules:\n'
            + '*Membership fee:* $15\n'
            + '*Shot Size:* 1 ounce\n'
            + '*Shot Prices:*\n' 
            + '\t$5 per shot for bottles worth up to $125.00\n'
            + '\t$10 per shot for bottles over $125.00',
    "mrkdwn": true
  };
 }

hears('rules', 'direct_mention,direct_message,mention', (bot, message) => {
  const { event } = message;
  if(event === 'direct_message')
  {
    bot.startPrivateConversation(message, rulesPrivateConversation(bot,message));
  }
  else
  {
    bot.reply(message, printRules());
  }
});

hears('menu', 'direct_mention,direct_message,mention', (bot, message) => {
  // Get the saved menu and display each item.
  const { user, channel, text } = message;

  try {
    channels.get("C65F14Q92", (err, data) => {
      //if(err) throw err;

      if( data && 'scotches' in data) {
        const { scotches } = data;

        var response = {
          "text": '*The Scotch Club Menu:*\n\n',
          "mrkdwn": true
        }
        for(var i = 0; i < scotches.length; i++)
        {
          response.text += '*Name:* ' + scotches[i].name + '\n'
          + '*Value:* ' + scotches[i].value + '\n'
          + '*Description:* ' + scotches[i].description + '\n\n';
        }

        bot.reply(message, response);
      }

    });
  }
  catch(error) {
    console.log(error);
  }
});

hears('add scotch (.*), (.*), (.*)', 'direct_mention,direct_message,mention', (bot, message) => {
  const { user, channel, text } = message;
  var scotch_name = message.match[1];
  var scotch_value = message.match[2];
  var scotch_description = message.match[3];

  var newScotch = { name: scotch_name, value: scotch_value, description: scotch_description};
  var data;
  try {
    data = channels.get("C65F14Q92", (err, data) => {
      if( data )
      {
        data.scotches.push(newScotch);

        channels.save(data, (err) => {
          if(err) throw err;

          console.log('scotch saved!')
        });
      }
      else
      {
        const saveData = {
          id: "C65F14Q92",
          scotches: [],
        };

        saveData.scotches.push(newScotch);

        channels.save(saveData, (err) => {
          if(err) throw err;

          console.log('scotch saved!')
        });
      }
    });
  } catch (error) {
    console.log(error);
  }
});

/*hears('add member', 'direct_mention, direct_message, mention', (bot,message) => {
  var response = {
    //"text": "Who do you want to add as a member?",
    "response_type": "in_channel",
    "attachments": [
      {
        "text": "Who do you want to add as a member?",
        "fallback": "Fallback text here",
        "color": "#3AA3E3",
        "attachment_type": "default",
        "callback_id": "select_simple_1234",
        "actions": [
            {
                "name": "members_list",
                "text": "Who to add?",
                "type": "select",
                "data_source": "users"
            }
        ]
      }
    ]
  }

  bot.reply(message, response);
});*/

hears(['help', 'commands'], 'direct_mention, direct_message, mention', (bot,message) => {
  var responseString = {
          "text": 'The following commands can be used via direct mention, or direct message: \n\n'
              + '*rules* - Replies with the rules of the SIS Scotch Club\n'
              + '*menu* - Replies with a list of currently available scotches.\n'
              + '*add scotch* - Allows new scotch to be added to the menu.\n'
              + '*help* or *commands* - Displays this help message.\n\n'
              + 'Example usage: @Scotchbot rules',

          "mrkdwn": true
        }
  
  bot.reply(message, responseString);
});