export declare class HttpProxyMe {
    private port;
    private _app;
    private _requestId;
    constructor(port: number);
    /**
     * @return Proxy
     */
    static createServer(port: number): HttpProxyMe;
    private getProxyUrl(req);
    private logRequest(req, res);
    private setRoutes();
}
