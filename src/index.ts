import * as express from "express";
import { Express } from "express-serve-static-core";

import * as request2 from "request";


let request = request2.defaults({ jar: true });

export class RedirectUrl {
  constructor(public from: string, public to: string) {

  }

}

export class HttpProxyMe {
  private _app: Express;
  private _requestId: number = 0;

  constructor(private port: number, private redirectUrls?: RedirectUrl[]) {

    this._app = express();

    this.setRoutes();

    this._app.listen(this.port, () => {
      console.log('server started on port', this.port);
      if (this.redirectUrls) {
        this.redirectUrls.forEach(redirectUrl => {
          console.log('Redirect urls from', redirectUrl.from, 'to', redirectUrl.to);
        })
      }
    });
  }

  /**
   * @return Proxy
   */
  static createServer(port: number, redirectUrls?: RedirectUrl[]): HttpProxyMe {
    return new HttpProxyMe(+port, redirectUrls);
  }


  private getProxyUrl(req: express.Request): string | null {

    if (!req.query.__proxy) {
      return null;
    }

    let url = req.query.__proxy;

    if (this.redirectUrls) {
      this.redirectUrls.forEach(redirectUrl => {
        if (url.match(redirectUrl.from)) {
          let newUrl = url.replace(redirectUrl.from, redirectUrl.to);
          console.log('Change URL', url, 'to', newUrl);
          url = newUrl;
        }
      })
    }

    return url;
  }

  private logRequest(req: express.Request, res: express.Response) {

    this._requestId++;

    let currentRequestId = this._requestId;

    let d = new Date();
    console.log('-------------');
    console.log('REQUEST', '#' + currentRequestId);

    console.log(d.toLocaleDateString());
    console.log(req.method, this.getProxyUrl(req));


    res.on('finish', function () {
      console.log('END REQUEST', '#' + currentRequestId, 'in', (Date.now() - d.getTime()), 'ms');
      console.log('-------------');
    });
  }

  private setRoutes() {
    this._app.all('*', (req: express.Request, res: express.Response, next: express.NextFunction) => {

      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Credentials", 'true');
      res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

      this.logRequest(req, res);

      next();
    });


    this._app.use('/', (req: express.Request, res: express.Response) => {

      let url = this.getProxyUrl(req);

      if (!url) {
        console.error("query parameter __proxy doesn't exist in", req.url);
        res.send("query parameter __proxy doesn't exist in " + req.url);
        return;
      }


      this.logRequest(req, res);

      console.log('PROXY TO', url);

      req.pipe(request(url)).pipe(res);

      req.on('data', (chunk) => {
        console.log('BODY\n', decodeURIComponent(chunk.toString()).split('&'));
      });
    })
  }
}
