# node-logger

Winston logger with sentry configuration included. Also show the file from which the log originated.

## Environment variable

|        Name          |                 Description                  |
| -------------------- | -------------------------------------------- |
| SENTRY_DSN           | Sentry's DNS                                 |
| SENTRY_APP           | The application's name                       |
| SENTRY_ENVIRONMENT   | The environment running (dev, staging, prod) |
| SENTRY_RELEASE       | The current release                          |
| CONSOLE_LOG_LEVEL    | The level of the logs displayed on the console (optional, defaults to info) |
| CAPTURE_UNHANDLED_REJECTIONS  | A value (true or false) saying if you want these exceptions to be logged in you app |

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

### Info

When logging info you are able to send the string (the info message) plus any other metadata you want as the second parameter.

```js
const logger = require('quintoandar-logger').getLogger(module);

const object = { id: 11, someInfo: 'someInfo' }
logger.info(`Some info about processing cool object with id ${object.id}`, { data: object });
```

It will be logged as a json:
```sh
{"level":"info","message":"Some info about processing cool object with id 10","extra_data":{"data":{"id":"11","someInfo":"someInfo"}},"logger_name":"path/to/my/file.js","timestamp":"2018-12-19T18:15:57.078Z"}
```

### Warning and Error

With warning and error messages the behaviour is similar, with one differece: both level of logging are submitted to Sentry, so if you want to submit metadata you need to include it on a specific key named `extra`.

```js
const logger = require('quintoandar-logger').getLogger(module);

const object = { id: 11, someInfo: 'someInfo' }
logger.error(`Some error while processing cool object with id ${object.id}`, { extra: { data: object } });
```

And then it will be displayed on Sentry under the field `Additional Data`.

## TODO

- Create Express Middleware Request Logger

