export declare class RedirectUrl {
  from: string;
  to: string;
  constructor(from: string, to: string);
}
export declare class HttpProxyMe {
  private port;
  private redirectUrls;
  private _app;
  private _requestId;
  constructor(port: number, redirectUrls?: RedirectUrl[]);
  /**
   * @return Proxy
   */
  static createServer(port: number, redirectUrls?: RedirectUrl[]): HttpProxyMe;
  private getProxyUrl(req);
  private logRequest(req, res);
  private setRoutes();
}
