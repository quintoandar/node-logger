# node-logger

Winston logger with sentry configuration included. Also show the file from which the log originated.

## Environment variable

|        Name          |                 Description                  |
| -------------------- | -------------------------------------------- |
| SENTRY_DSN           | Sentry's DNS                                 |
| SENTRY_APP           | The application's name                       |
| SENTRY_ENVIRONMENT   | The environment running (dev, staging, prod) |
| SENTRY_RELEASE       | The current release                          |

## Usage

```sh
npm install --save git+https://github.com/quintoandar/node-logger.git
```

```js
const logger = require('5a-node-logger').getLogger(module);

logger.info("Some info");
```

## TODO

- Create Express Middleware Request Logger

