const fs = require('fs');
const { Client, Collection, Intents, MessageEmbed, GuildMember } = require('discord.js');
require("dotenv").config();
const mongoose = require("mongoose");
const profileModel = require("./models/profileSchema");
const badwordsArray = require("./badwords.js")

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MEMBERS] });

const prefix = process.env.PREFIX

client.commands = new Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
	console.log(`${command.name}.js loaded!`);
}

mongoose
  .connect(process.env.MONGODB_SRV, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useFindAndModify: false,
  })
  .then(() => {
	console.log("Connected to the database!");	
})
.catch((err) => {
	console.log(err);
});

client.on('ready', () => {
	console.log('Ready!');
	client.user.setActivity(`tank farms`, { type: 'WATCHING' });
});

client.on('guildMemberAdd', async member => {
let profile = await profileModel.create({
    userID: member.id,
    serverID: member.guild.id,
    coins: 1000,
    bank: 0,
  });
  profile.save();
})

client.on('messageCreate', async message => {
	let foundInText = false;
    	for (var i in badwordsArray) {
      	if (message.content.toLowerCase().includes(badwordsArray[i].toLowerCase())) foundInText = true;
	if (message.channel.name === "😂memes-zone") return;
    	}
    	if (foundInText) {
                let logChannel = message.guild.channels.cache.find(channel => channel.name === "logs");
                if (!logChannel) return message.channel.send("There is no channel called 'log', please create one and make sure the bot can send messages in it!");

                let embed2 = new MessageEmbed()
                .setColor("YELLOW")
                .setDescription(`${message.author} sent a blacklisted word in ${message.channel}`)
		
                let embed = new MessageEmbed()
		.setColor("YELLOW")
		.setDescription(`${message.author}, Hey you can't use phrohibited/blacklisted words here!`)
       		message.delete().then(message.channel.send({ embeds: [embed] }))
                logChannel.send({ embeds: [embed2] })
	}
	if (!message.content.startsWith(prefix) || message.author.bot) return;
	
	let profileData;
  	try {
    		profileData = await profileModel.findOne({ userID: message.author.id });
    	if (!profileData) {
      		let profile = await profileModel.create({
        	userID: message.author.id,
        	serverID: message.guild.id,
        	coins: 1000,
        	bank: 0,
      	   });
      		profile.save();
    	   }
  	   } catch (err) {
    		console.log(err);
  	   }

	const args = message.content.slice(prefix.length).trim().split(/ +/);
	const command = args.shift().toLowerCase();
	
	if(!cooldowns.has(command.name)){
        cooldowns.set(command.name, new Discord.Collection());
    }

    const current_time = Date.now();
    const time_stamps = cooldowns.get(command.name);
    const cooldown_amount = (command.cooldown) * 1000;

    if(time_stamps.has(message.author.id)){
        const expiration_time = time_stamps.get(message.author.id) + cooldown_amount;

        if(current_time < expiration_time){
            const time_left = (expiration_time - current_time) / 1000;

            return message.reply(`Please wait ${time_left.toFixed(1)} more seconds before using ${command.name}`);
        }
    }

    time_stamps.set(message.author.id, current_time);
    setTimeout(() => time_stamps.delete(message.author.id), cooldown_amount);

	try {
		client.commands.get(command).execute(message, args, client, profileData)
	} catch (error) {
		console.error(error);
		message.reply('There was an error trying to execute that command, pinging <@691634056278048778> to fix it!');
	}
});

client.login(process.env.DISCORD_TOKEN);
