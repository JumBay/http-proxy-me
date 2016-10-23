# http-proxy-me

Create a very simple http proxy that intercepts every queries and forward them to the given target.
Very usefull if you have CORS issues.

# How it works?

First you have to create the server: 
```ts
import {HttpProxyMe} from './index';

HttpProxyMe.createServer(+process.env.PORT || 3001);
```

Then you have to request the created server with the target you want to rich like that: 
```
http://localhost:3001?__proxy=http://my.target.com/page?p=1&sort=asc
```
