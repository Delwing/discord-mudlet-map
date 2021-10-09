const { Client, version } = require("discord.js");
const mapCommand = require("./events/map-command");
const { downloader, retryingDownloader } = require("./providers");
const { plainRegexp } = require("./extractors");

const major = parseInt(version.substring(0, version.indexOf(".")));
const eventName = major >= 13 ? "messageCreate" : "message";

/**
 *
 * @param {Client} client
 */
module.exports = (client) => {
  client.on(
    eventName,
    mapCommand({
      Arkadia: { locationExtractor: plainRegexp("!lok (\\d+)"), provider: retryingDownloader("./internal/map_sync", { retries: 10, delay: 10000 }) },
      "Arkadia Public": { locationExtractor: plainRegexp("!public (\\d+)"), provider: retryingDownloader("http://arkadia.kamerdyner.net/master3/map_master3.dat1", { retries: 5 }) },
      Achea: { locationExtractor: plainRegexp("!achea (\\d+)"), provider: downloader("https://raw.githubusercontent.com/IRE-Mudlet-Mapping/AchaeaCrowdmap/gh-pages/Map/map") },
    })
  );
};
