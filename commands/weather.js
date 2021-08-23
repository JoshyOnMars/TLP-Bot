const { MessageEmbed } = require('discord.js');
const weather = require('weather-js');

module.exports = {
    name: 'weather',
    async execute(message, args, client) {
    
        weather.find({search: args.join(" "), degreeType: 'C'}, function (error, result){
        // 'C' can be changed to 'F' for farneheit results
        if(error) return message.channel.send(error);
        if(!args[0]) return message.channel.send('Please specify a location')

        if(result === undefined || result.length === 0) return message.channel.send('**Invalid** location');

        var current = result[0].current;
        var location = result[0].location;

        const weatherinfo = new MessageEmbed()
        .setDescription(`**${current.skytext}, Day & Time: \`${current.day}\`, \`${current.observationtime}\`**`)
        .setAuthor(`Weather forecast for ${current.observationpoint}`)
        .setThumbnail(current.imageUrl)
        .setColor("BLUE")
        .addField('Temperature', `${current.temperature}°C`, true)
        .addField('Wind', current.winddisplay, true)
        .addField('Humidity', `${current.humidity}%`, true)


        message.channel.send({ embeds: [weatherinfo] })
        })        
    },
};
