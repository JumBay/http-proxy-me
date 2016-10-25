"use strict";
var index_1 = require('./index');
var redirectUrls = [];
redirectUrls.push(new index_1.RedirectUrl('http://www.google.fr', 'http://google.fr'));
index_1.HttpProxyMe.createServer(+process.env.PORT || 3001, redirectUrls);
//# sourceMappingURL=demo.js.map