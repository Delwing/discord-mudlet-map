import http, { type IncomingMessage } from "http";
import https from "https";
import type { WriteStream } from "fs";
import type { MapProvider } from "./types.js";

export interface RetryOptions {
  retries?: number;
  delay?: number;
}

export function downloader(url: string): MapProvider {
  return (writeStream: WriteStream) =>
    new Promise<void>((resolve, reject) => {
      const protocol = url.startsWith("https") ? https : http;
      protocol
        .get(url, (response: IncomingMessage) => {
          const status = response.statusCode ?? 500;
          if (status < 400) {
            response.pipe(writeStream);
            writeStream.on("finish", () => {
              writeStream.close();
              resolve();
            });
            response.on("error", reject);
          } else {
            reject(
              new Error(
                `Can't download map: ${response.statusCode} ${response.statusMessage}`,
              ),
            );
          }
        })
        .on("error", reject);
    });
}

export function retryingDownloader(
  url: string,
  retryOptions?: RetryOptions,
): MapProvider {
  return (writeStream) => {
    const options: Required<RetryOptions> = {
      retries: 3,
      delay: 1000,
      ...retryOptions,
    };
    return downloader(url)(writeStream).catch((err: unknown) => {
      if (options.retries > 0) {
        return new Promise<void>((resolve) => {
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
