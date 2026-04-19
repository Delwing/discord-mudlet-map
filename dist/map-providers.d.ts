import type { MapProvider } from "./types.js";
export interface RetryOptions {
    retries?: number;
    delay?: number;
}
export declare function downloader(url: string): MapProvider;
export declare function retryingDownloader(url: string, retryOptions?: RetryOptions): MapProvider;
//# sourceMappingURL=map-providers.d.ts.map