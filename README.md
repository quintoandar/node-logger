# node-logger

Winston logger with sentry configuration included. Also show the file from which the log originated.

## Environment variable

### Mandatory (Sentry logging won't start if they are not defined)

|        Name          |                 Description                       |
| -------------------- | ------------------------------------------------- |
| SENTRY_DSN           | Sentry's DNS                                      |
| SENTRY_APP           | The application's name                            |
| SENTRY_ENVIRONMENT   | The environment running (dev, staging, prod, etc) |


### Optional

|        Name          |                 Description                  |
| -------------------- | -------------------------------------------- |
| SENTRY_RELEASE       | The current application release (defaults to None) |
| CONSOLE_LOG_LEVEL    | The level of the logs displayed on the console (defaults to info and up) |
| SENTRY_LOG_LEVEL     | The level of the logs submitted to Sentry (defaults to warn and up) |

## Setting up

```sh
npm install --save git+https://github.com/quintoandar/node-logger.git#<latest-release-version>
```

Or add it on your `package.json` file like:

```sh
"dependencies": {
  "quintoandar-logger": "git+https://github.com/quintoandar/node-logger.git#<latest-release-version>",
},
```

[See releases](https://github.com/quintoandar/node-logger/releases)

## Usage

With info, warn and error messages the behaviour is the same. You are able to send the string (the info message) plus any other metadata you want as the second parameter, but be sure to add this data on a specific key named `extra` so that Sentry knows how to parse it and display it.

```js
const logger = require('quintoandar-logger').getLogger(module);

const object = { id: 11, someInfo: 'someInfo' }
logger.info(`Some info about processing cool object with id ${object.id}`, { extra: { data: object } });
logger.warn(`Some warning about processing cool object with id ${object.id}`, { extra: { data: object } });
logger.error(`Some error while processing cool object with id ${object.id}`, { extra: { data: object } });
```

On the console it will be logged as a json:
```sh
{"level":"info","message":"Some info about processing cool object with id 10","extra_data":{"extra":{"data":{"id":"11","someInfo":"someInfo"}}},"logger_name":"path/to/my/file.js","timestamp":"2018-12-19T18:15:57.078Z"}
```

And on Sentry the data on `extra` will be displayed under the field `Additional Data`.

## TODO

- Create Express Middleware Request Logger

