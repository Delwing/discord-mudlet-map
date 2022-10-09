const { Message, Client } = require("discord.js");
const { Renderer } = require("mudlet-map-renderer");
const sharp = require("sharp");

/**
 *
 * @param {Client} client
 * @param {Message} message
 */
module.exports = (config) => {
    return async (message) => {
    Object.keys(config).forEach((key) => {
      let element = config[key];
      let reader = element.reader;
      let roomId = element.locationExtractor(message.content, reader);
      if (roomId) {
        if (!reader) {
            message.channel.send(`${key} - map not ready`);  
            return;
        }
        let area = reader.getAreaByRoomId(roomId);
        if (!area) {
          message.channel.send(`${key} - no location ID`);
          return;
        }
        if (element.renderFragment) {
            area = area.limit(roomId, 15)
            if (element.settings == undefined) {
                element.settings = {}
            }
            if (element.settings.areaName == undefined) {
                element.settings.areaName = false;
            }
        }
        async function render() {
          let renderer = new Renderer(null, reader, area, reader.getColors(), element.settings);
          renderer.renderPosition(roomId);
          sharp(Buffer.from(renderer.exportSvg(roomId, 10)))
            .png()
            .toBuffer()
            .then((buffer) => {
              message.channel.send({content: `${key} - ${area.areaName}`, files:[
                { attachment: buffer, name: `${key} - ${roomId}.png` }
              ]})
            })
            .catch(function (err) {
              console.log(err);
            });
        }
        render();
      }
    });
  };
};
