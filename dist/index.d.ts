export declare class Proxy {
    private port;
    private _app;
    private _requestId;
    constructor(port: number);
    /**
     * @return Proxy
     */
    static createServer(port: number): Proxy;
    private getProxyUrl(req);
    private logRequest(req, res);
    private setRoutes();
}
