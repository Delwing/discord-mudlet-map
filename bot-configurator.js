const { Client, version } = require("discord.js");
const mapCommand = require("./events/map-command");

const major = parseInt(version.substring(0, version.indexOf(".")));
const eventName = major >= 13 ? "messageCreate" : "message";

/**
 *
 * @param {Client} client
 */
module.exports = (client, config) => {
  client.on(
    eventName,
    mapCommand(config)
  );
};
