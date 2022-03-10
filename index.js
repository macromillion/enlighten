var data = {
  username: message.author.id
  data: {
    points: 3
  }
}

var variable = 'user';

console.log(data.points)

nigga()

const Discord = require('discord.js');
const client = new Discord.Client();
const fs = require('fs');

client.on('ready', () => {
  console.clear()
  console.log(`${client.user.username} is online!`);
});

// Settings
const prefix = '!';
const checkinAmt = 1;
const embedColor = '#FFFFFF';
const debugMode = false;

// Functions
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
}

function makeError(title = 'Error', description = 'Something went wrong!') {
  var embed = new Discord.MessageEmbed()
    .setColor(embedColor)
    .setTitle(title)
    .setDescription(description);
  return embed
}

function makeNotifier(description = 'Something went wrong!') {
  var embed = new Discord.MessageEmbed()
    .setColor(embedColor)
    .setAuthor(description, 'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/160/microsoft/209/bell_1f514.png')
  return embed
}

function writeData(userid, data, amount) {
  if (data === 'points') {
    data = {
      userid: {
        points: amount
      }
    };
  }
  var datastring = JSON.stringify(data);
  fs.writeFile('data/users.json', datastring, function(err, result) {
    if (err) console.log('error', err);
  });
}


// Commands
client.on('message', message => {
  if (!message.content.startsWith(prefix)) return;

  // Store arguements
  const args = message.content.trim().split(/ +/g);

  // Allow any capitalization
  const cmd = args[0].slice(prefix.length).toLowerCase();

  // Ping command
  if (cmd === 'ping') {
    message.channel.send(embPing);
  }

  // Repeat command
  if (cmd === 'repeat') {
    if (!args[1] || args[2]) return message.channel.send(makeNotifier('Please provide all required parameters!'));
    message.channel.send(args[1]);
  }

  // Gamble command
  if (cmd === 'gamble') {
    if (!args[1] || args[2]) return message.channel.send(errParam);

    // Roll the die
    var dieRoll = getRandomInt(1, 6);

    // Check if win
    if (dieRoll === 1) {
      message.channel.send(makeNotifier('You won!'))
      var gamble = args[1] * 2;
    } else {
      message.channel.send(makeNotifier('You lost!'))
    }
  }

  // Checkin command
  if (cmd === 'checkin') {
    fs.readFile('data/users.json', function read(err, data) {

      var userid = message.author.id;

      // Check if user has data
      try {
        var parsed = JSON.parse(data);
        var prePoints = parsed.userid.points;
        console.log(parsed.userid.points)
      }
      catch (err) {
        data = {
          [userid]: {
            points: 1
          }
        };
        var prePoints = 1;
      }

      // Assign and notify
      var postPoints = prePoints + checkinAmt;
      message.channel.send('You now have ' + postPoints + ' points!');

      // Write to file
      data = {
        [userid]: {
          points: postPoints
        }
      };
      var datastring = JSON.stringify(data);
      fs.writeFile('data/users.json', datastring, function(err, result) {
        if (err) console.log('error', err);
      });
    });
  }
});

client.login('');