const { Client, version } = require("discord.js");
const mapCommand = require("../events/messageCreate");
const MapResolver = require("../maps/prepare-map");
const major = parseInt(version.substring(0, version.indexOf(".")));
const eventName = major >= 13 ? "messageCreate" : "message";

/**
 *
 * @param {Client} client
 */
module.exports = (client, config) => {
  const configurator = () => {
    Object.keys(config).map(async (key) => {
      MapResolver.prepareMap(key, config[key].provider)
        .then((reader) => {
          config[key].reader = reader;
          console.log(`${key} map ready!`);
        })
        .catch((err) => console.log(err));
    });
  };
  configurator();

  client.on(eventName, mapCommand(config));

  client.on("ready", () => {
    console.log("Bot enhanced with Mudlet maps ready.");
  });

  return configurator
};
