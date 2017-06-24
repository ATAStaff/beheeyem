const Discord = require("discord.js");
const beheeyem = new Discord.Client();
const fs = require("fs");
const jsonfile = require("jsonfile");
const path = require("path");
const request = require("request");
const colors = require('colors');
var config = require('./config.js');

var imageCheck;

console.log("Starting Beheeyem...");

var commands = loadCommands();

beheeyem.on("ready", function() {
    console.log(("Beheeyem is active! Currently serving in " + String(beheeyem.guilds.size).white + " guilds.\n".green).bold);
    beheeyem.user.setGame("b.help");
    try {
        request.post("https://bots.discord.pw/api/bots/" + beheeyem.user.id + "/stats", {
            server_count: beheeyem.guilds.size
        });
    } catch (err) {
        console.log("Could not update server count on Discord Bots website.".yellow);
    }


});

function loadCommands() {
    console.log('Loading commands...'.cyan)
    var commands = {};
    let errCount = 0;
    cmdfiles = fs.readdirSync('./commands/');
    cmdfiles.forEach(filename => {
        var cmdName = filename.split('.')[0];
        try {
            commands[cmdName] = require('./commands/' + filename);
            console.log('Loaded '.green + cmdName.yellow.bold);
        } catch (err) {
            if (err) {
                errCount++;
                console.log('Error in '.red + cmdName.yellow + '!'.red);
            }
        }
    });
    console.log('Loaded commands with '.cyan + (errCount > 0 ? errCount.red : 'no'.green) + ' errors!'.cyan);
    return commands;
}

beheeyem.on("message", msg => {
    if (msg.author.id != beheeyem.user.id && !msg.author.bot) {
        if (msg.content.startsWith(config.prefix)) {
            var commandstring = msg.content.substring(config.prefix.length);
            var cmd = commandstring.split(" ")[0];
            var args = commandstring.substring(cmd.length + 1);

            if (commands[cmd]) {
                commands[cmd].action(msg, args, beheeyem);
            } else if (cmd == "obtain") {
                msg.channel.sendMessage("Honestly, just use Bulbapedia. The encounter data on the web is so inconsistent and undreadable that there's no way I could create an obtainability command. Sorry about that. 🙁");
            } else if (cmd == "deathbird") {
                msg.channel.sendFile("https://i.imgur.com/pIxQQXA.png", "DEATHBIRD.png");
            } else if (cmd == "youtried") {
                msg.channel.sendFile("https://i.imgur.com/bAxMdQ0.png", "Filename.jpeg.gif.webp.mp4.exe.bat.sh.app.png");
            } else if (msg.author.id == 120887602395086848) {
                if (cmd == "addnonya") {
                    var nonyas = require("./data/nonyas.json");
                    nonyas.nonyas.push(args);
                    jsonfile.writeFileSync("./data/nonyas.json", nonyas);
                    msg.channel.sendMessage("👌🏾 Sucessfully added Nonya!");
                } else if (cmd == 'eval') {
                    msg.channel.sendMessage(eval(args));
                }
            }
        }
        imageCheck = false;
        checkItalics(msg);
    }
});


beheeyem.login(config.token);

beheeyem.on("guildCreate", (guild) => {
    try {
        request.post({
            url: "https://bots.discord.pw/api/bots/" + beheeyem.user.id + "/stats",
            headers: {
                authorization: config.dbotsToken
            }
        }, {
            server_count: beheeyem.guilds.size
        });
    } catch (err) {
        console.log("Could not update server count on Discord Bots website.".yellow);
    }
});


function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function checkItalics(msg) {
    var isFound = false;
    var asteriskSplit = msg.content.split("*");
    for (var i = 1; i < asteriskSplit.length - 1; i++) {
        var pokeName = asteriskSplit[i].toLowerCase();
        pokename = pokeName.replace(" ", "-").split("-").map(capitalizeFirstLetter).join("-");
        request("http://smogon.com/dex/media/sprites/xy/" + pokeName + ".gif", (err, response) => {
            if (response.statusCode == 200) {
                msg.channel.sendFile("http://smogon.com/dex/media/sprites/xy/" + pokeName + ".gif");
                isFound = true;
            }
        });
        if (isFound) break;
    }
    if (!isFound) {
        var underSplit = msg.content.split("_");
        for (var i = 1; i < underSplit.length - 1; i++) {
            var pokeName = underSplit[i].toLowerCase();
            pokename = pokeName.replace(" ", "-").split("-").map(capitalizeFirstLetter).join("-");
            request("http://smogon.com/dex/media/sprites/xy/" + pokeName + ".gif", (err, response) => {
                if (response.statusCode == 200) {
                    isFound == true;
                    msg.channel.sendFile("http://smogon.com/dex/media/sprites/xy/" + pokeName + ".gif");
                }
            });
            if (isFound) break;
        }
    }
}