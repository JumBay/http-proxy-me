"use strict";
var express = require("express");
var request2 = require("request");
var request = request2.defaults({ jar: true });
var RedirectUrl = (function () {
    function RedirectUrl(from, to) {
        this.from = from;
        this.to = to;
    }
    return RedirectUrl;
}());
exports.RedirectUrl = RedirectUrl;
var HttpProxyMe = (function () {
    function HttpProxyMe(port, redirectUrls) {
        var _this = this;
        this.port = port;
        this.redirectUrls = redirectUrls;
        this._requestId = 0;
        this._app = express();
        this.setRoutes();
        this._app.listen(this.port, function () {
            console.log('server started on port', _this.port);
            if (_this.redirectUrls) {
                _this.redirectUrls.forEach(function (redirectUrl) {
                    console.log('Redirect urls from', redirectUrl.from, 'to', redirectUrl.to);
                });
            }
        });
    }
    /**
     * @return Proxy
     */
    HttpProxyMe.createServer = function (port, redirectUrls) {
        return new HttpProxyMe(+port, redirectUrls);
    };
    HttpProxyMe.prototype.getProxyUrl = function (req) {
        if (!req.query.__proxy) {
            return null;
        }
        var url = req.query.__proxy;
        if (this.redirectUrls) {
            this.redirectUrls.forEach(function (redirectUrl) {
                if (url.match(redirectUrl.from)) {
                    var newUrl = url.replace(redirectUrl.from, redirectUrl.to);
                    console.log('Change URL', url, 'to', newUrl);
                    url = newUrl;
                }
            });
        }
        return url;
    };
    HttpProxyMe.prototype.logRequest = function (req, res) {
        this._requestId++;
        var currentRequestId = this._requestId;
        var d = new Date();
        console.log('-------------');
        console.log('REQUEST', '#' + currentRequestId);
        console.log(d.toLocaleDateString());
        console.log(req.method, this.getProxyUrl(req));
        res.on('finish', function () {
            console.log('END REQUEST', '#' + currentRequestId, 'in', (Date.now() - d.getTime()), 'ms');
            console.log('-------------');
        });
    };
    HttpProxyMe.prototype.setRoutes = function () {
        var _this = this;
        this._app.all('*', function (req, res, next) {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Credentials", 'true');
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
            _this.logRequest(req, res);
            next();
        });
        this._app.use('/', function (req, res) {
            var url = _this.getProxyUrl(req);
            if (!url) {
                console.error("query parameter __proxy doesn't exist in", req.url);
                res.send("query parameter __proxy doesn't exist in " + req.url);
                return;
            }
            _this.logRequest(req, res);
            console.log('PROXY TO', url);
            req.pipe(request(url)).pipe(res);
            req.on('data', function (chunk) {
                console.log('BODY\n', decodeURIComponent(chunk.toString()).split('&'));
            });
        });
    };
    return HttpProxyMe;
}());
exports.HttpProxyMe = HttpProxyMe;
//# sourceMappingURL=index.js.map