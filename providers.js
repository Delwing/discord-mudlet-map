const http = require("http");
const https = require("https");

let downloader = (url) => (writeStream) => {
  return new Promise((resolve, reject) => {
    let protocol = url.startsWith("https") ? https : http;
    protocol.get(url, function (response) {
      if (response.statusCode < 400) {
        response.pipe(writeStream);
        response.on("end", () => resolve());
        response.on("error", (err) => reject(err));
      } else {
        reject(new Error(`Can't download map: ${response.statusCode} ${response.statusMessage}`));
      }
    });
  });
};

let retryingDownloader = (url, retryOptions) => (writeStream) => {
  let defaultOptions = {
    retries: 3,
    delay: 1000,
  };
  let options = { ...defaultOptions, ...retryOptions };
  return downloader(url)(writeStream).catch((err) => {
    if (options.retries > 0) {
      return new Promise((resolve, reject) =>
        setTimeout(() => {
            options.retries--;
            console.log("RETRY")
          resolve(retryingDownloader(url, options)(writeStream));
        }, options.delay)
      );
    }
    throw err;
  });
};

module.exports = {
  downloader: downloader,
  retryingDownloader: retryingDownloader,
};
