const { MessageEmbed } = require("discord.js")
const profileModel = require("../models/profileSchema");

module.exports = {
  name: "work",
  cooldown: 3600,
  async execute(message, args, client, profileData) {
    const jobs = [
      {job: "YouTuber", salary: 10000},
      {job: "Streamer", salary: 15000}
    ]
    console.log(jobs.job)
    console.log(jobs[0].salary)
    
    //const response = await profileModel.findOneAndUpdate(
    //  {
    //    userID: message.author.id,
    //  },
    //  {
    //    $inc: {
    //      coins: randomNumber,
    //    },
    //  }
    //);
    //return message.channel.send(`${message.author}, You worked and you earnt ${randomNumber} coins!`);
  },
};
