const fs = require("fs");

const { MudletMapReader } = require("mudlet-map-binary-reader");
const { MapReader } = require("mudlet-map-renderer");

const downloadDir = "downloads";

function ensureDirectoryExists(key) {
  return new Promise((resolve, reject) => {
    fs.access(key, (err) => {
      if (err) {
        fs.mkdir(key, { recursive: true }, (err) => {
          if (!err) {
            resolve();
          } else {
            reject(err);
          }
        });
      } else {
        resolve();
      }
    });
  });
}

function prepareMap(key, provider) {
  return ensureDirectoryExists(`./${downloadDir}/${key}`)
    .then(() => provider(fs.createWriteStream(`./${downloadDir}/${key}/map.dat`)))
    .then(
      () =>
        new Promise((resolve, reject) => {
          let map = MudletMapReader.read(`./${downloadDir}/${key}/map.dat`);
          MudletMapReader.export(map, `./${downloadDir}/${key}/`);
          let mapData = require(`../${downloadDir}/${key}/mapExport.json`);
          let mapColors = require(`../${downloadDir}/${key}/colors.json`);
          let reader = new MapReader(mapData, mapColors);
          resolve(reader);
        })
    );
}

module.exports = {
  prepareMap: prepareMap,
};
