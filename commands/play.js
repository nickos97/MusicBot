const ytdl = require('ytdl-core');
const ytSearch = require('yt-search');
const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus, getNextResource } = require('@discordjs/voice');
const Disc = require('discord.js');
const { info } = require('console');
path = require('path')
const { exec } = require("child_process")


module.exports = {
    name: 'play',
    decription: '',
    async execute(message, args, client) {


        client.user.setStatus("online");
        const videoFinder = async(query) => {
            const videoResult = await ytSearch(query);
            return (videoResult.videos.length > 1) ? videoResult.videos[0] : null;
        }
        const video = await videoFinder(args.join(' '));



        client.channels.fetch(message.member.voice.channel.id).then(channel => {
            const VoiceConnection = joinVoiceChannel({
                channelId: channel.id,
                guildId: channel.guild.id,
                adapterCreator: channel.guild.voiceAdapterCreator,
            });



            const promise = new Promise((resolve, reject) => {
                stream = (ytdl(video.url, {
                    quality: "lowest",
                }).on('info', (info) => {
                    client.user.setActivity(info.videoDetails.title)
                }))
                if (stream)
                    resolve(stream);
                else
                    reject("Error")
            });
            promise.then(
                function(stream) {
                    const resource = createAudioResource(stream, { inlineVolume: true, metadata: { title: "Youtube song", }, });
                    resource.volume.setVolume(0.5);
                    const player = createAudioPlayer();
                    VoiceConnection.subscribe(player);

                    intro(message, video);

                    player.play(resource)

                    player.on(AudioPlayerStatus.Idle, () => {

                        try {
                            player.stop();
                        } catch (e) {}
                        try {
                            VoiceConnection.destroy()
                            client.user.setActivity("music bitchezzz")
                        } catch (e) {}
                    })
                    player.on('error', error => {
                        console.error(`Error: ${error.message} with resource ${error.resource.metadata.title}`);
                        exec("nodemon")

                    });
                },
                function(error) {
                    console.log(`Promise didn't resolve, Error: ${error}`)
                }

            )

        }).catch(console.error)
    }
}

function intro(message, video) {
    message.channel.send("Playing...")
    message.channel.send(video.url)
}