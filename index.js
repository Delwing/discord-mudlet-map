require('dotenv').config()
const botConfigurator = require("./bot-configurator")
const Discord = require("discord.js");
const client = new Discord.Client();

const { downloader, retryingDownloader } = require("./providers");
const { plainRegexp } = require("./extractors");

let config = {
  Arkadia: { locationExtractor: plainRegexp("!lok (\\d+)"), provider: require("./internal/kamerdyner") },
  "Arkadia Public": { locationExtractor: plainRegexp("!public (\\d+)"), provider: retryingDownloader("http://arkadia.kamerdyner.net/master3/map_master3.dat", { retries: 5 }) },
  Achea: { locationExtractor: plainRegexp("!achea (\\d+)"), provider: downloader("https://raw.githubusercontent.com/IRE-Mudlet-Mapping/AchaeaCrowdmap/gh-pages/Map/map") },
};

botConfigurator(client, config);

client.login(process.env.BOT_TOKEN);
