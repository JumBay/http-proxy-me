import { HttpProxyMe, RedirectUrl } from './index';

let redirectUrls = [];

redirectUrls.push(new RedirectUrl('http://www.google.fr', 'http://google.fr'));

HttpProxyMe.createServer(+process.env.PORT || 3001, redirectUrls);
