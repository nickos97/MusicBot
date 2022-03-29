const { joinVoiceChannel,createAudioPlayer,createAudioResource,getVoiceConnection } = require('@discordjs/voice');

module.exports = {
    name:'stop',
    decription: '',
    async execute(message,client){
        client.channels.fetch(message.member.voice.channel.id).then(channel=>{
            const VoiceConnection = getVoiceConnection(channel.guild.id)
            VoiceConnection.destroy();
            client.user.setActivity("music bitchezzz")
            message.react('👌')
        })
    }
}
