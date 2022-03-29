const Discord = require("discord.js");
const config = require("./config.json");
//const ytdl = require('ytdl-core');
const fs = require("fs");
const client = new Discord.Client({ intents: ["GUILDS", "GUILD_MEMBERS", "GUILD_BANS", "GUILD_EMOJIS_AND_STICKERS", "GUILD_INTEGRATIONS", "GUILD_WEBHOOKS", "GUILD_INVITES", "GUILD_VOICE_STATES", "GUILD_PRESENCES", "GUILD_MESSAGE_REACTIONS", "GUILD_MESSAGE_TYPING", "DIRECT_MESSAGE_REACTIONS", "DIRECT_MESSAGE_TYPING", "GUILD_MESSAGES", "DIRECT_MESSAGES"], partials: ["CHANNEL"] });
//const { getVoiceConnection, joinVoiceChannel, AudioPlayerStatus, createAudioResource, getNextResource, createAudioPlayer, NoSubscriberBehavior } = require('@discordjs/voice');
client.once("ready", () => {
    console.log("Hey, I booted!");
    client.user.setActivity("music bitchezzz")
    client.user.setStatus("idle");
});

const prefix = "!";
client.commands = new Discord.Collection()

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}
client.on("messageCreate", async message => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;
    if (message.member.voice.channel == null) {
        return;
    }
    //

    const args = message.content.slice(prefix.length).split(/ +/);
    const command = args.shift().toLowerCase();
    if (command === 'play') {
        client.commands.get('play').execute(message, args, client);
    }

    if (command === 'stop' && !args.length) {
        client.commands.get('stop').execute(message, client);

    }

});

client.on('shardError', error => {
    console.error('A websocket connection encountered an error:', error);
});
client.login(config.token);