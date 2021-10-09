require('dotenv').config()
const botConfigurator = require("./bot-configurator")
const Discord = require("discord.js");
const client = new Discord.Client();

botConfigurator(client)

client.login(process.env.BOT_TOKEN)