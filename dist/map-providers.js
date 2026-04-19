import http from "http";
import https from "https";
export function downloader(url) {
    return (writeStream) => new Promise((resolve, reject) => {
        const protocol = url.startsWith("https") ? https : http;
        protocol
            .get(url, (response) => {
            const status = response.statusCode ?? 500;
            if (status < 400) {
                response.pipe(writeStream);
                writeStream.on("finish", () => {
                    writeStream.close();
                    resolve();
                });
                response.on("error", reject);
            }
            else {
                reject(new Error(`Can't download map: ${response.statusCode} ${response.statusMessage}`));
            }
        })
            .on("error", reject);
    });
}
export function retryingDownloader(url, retryOptions) {
    return (writeStream) => {
        const options = {
            retries: 3,
            delay: 1000,
            ...retryOptions,
        };
        return downloader(url)(writeStream).catch((err) => {
            if (options.retries > 0) {
                return new Promise((resolve) => {
                    setTimeout(() => {
                        options.retries--;
                        console.log(`Retrying download from ${url}`);
                        resolve(retryingDownloader(url, options)(writeStream));
                    }, options.delay);
                });
            }
            throw err;
        });
    };
}
//# sourceMappingURL=map-providers.js.map