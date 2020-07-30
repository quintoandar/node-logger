# node-logger

Winston logger with sentry configuration included. Also show the module, file path and caller from which the log originated.

**Now with types**

## Environment variable

|        Name          |                 Description                  |
| -------------------- | -------------------------------------------- |
| CONSOLE_LOG_LEVEL    | The level of the logs displayed on the console (optional, defaults to info) |
| NODE_ENV             | The application environment running (development, test, production) |
| PRETTY_LOGS          | Enable colored logs with clean spacing       |
| SENTRY_APP           | The application's name                       |
| SENTRY_DSN           | Sentry's DNS                                 |
| SENTRY_ENVIRONMENT   | The environment running (dev, staging, prod) |
| SENTRY_LOGGER_LEVEL  | The level of the logs displayed at Sentry (optional, defaults to warn) |
| SENTRY_RELEASE       | The current release                          |

## Setting up

```sh
npm install github:quintoandar/node-logger#semver:~<latest-release-version>
```

Or add it on your `package.json` file like:

```sh
"dependencies": {
    "quintoandar-logger": "github:quintoandar/node-logger#semver:~<latest-release-version>
  },
```

[See releases](https://github.com/quintoandar/node-logger/releases)

## Usage

With info, warn and error messages the behaviour is the same. You are able to send the string (the info message) plus any other metadata you want as the second parameter, but be sure to add this data on a specific key named `extra` so that Sentry knows how to parse it and display it.

Since the Kibana application, by default, set a timestamp value to its logs, if the `NODE_ENV` env var was equals to `production` this field will be supressed at the logs. To enable it to show, its necessary to set a different value to this variable: (`development` or `test`).

```js
const logger = require('quintoandar-logger').getLogger(module);

const object = { id: 11, someInfo: 'someInfo' }
logger.info(`Some info about processing cool object with id ${object.id}`, object);
logger.warn(`Some warning about processing cool object with id ${object.id}`, object);
logger.error(`Some error while processing cool object with id ${object.id}`, object);
```

On the console it will be logged as a json:

```sh
[info] Some info about processing cool object with id 11 { extra: { id: 11, someInfo: 'someInfo' } }, module: 'path/to/my/file.js', timestamp: '2020-06-09T22:46:21.759Z'}
```

With pretty log enabled:

```sh
[info] Some info about processing cool object with id 11
{
  extra: {
        id: 11,
        someInfo: 'someInfo'
    }
  },
  module: 'path/to/my/file.js',
  timestamp: '2020-06-08T15:35:29.122Z'
}
```

And on Sentry the data on `extra` will be displayed under the field `Additional Data`.

## Sentry

There is a method tha can start sentry for you.

```js
const quintoandarLogger = require('quintoandar-logger');
const sentryParams = {} //there are some default values if object is empty
const logger = quintoandarLogger.startSentry(sentryParams).getLogger(module)
```

### Tracer

If your project is using the honeycomb tracer library, you can include the tracer Id of the instance running to the logger.

On your code, you just need to intanciate the tracer within the logger library once.

```js
const tracer = { currentRootSpan: { traceId: 'TRACER-ID' } };

const quintoandarLogger = require('quintoandar-logger');
const logger = quintoandarLogger.startSentry({}).setTracer(tracer).getLogger(module);

const object = { id: 11, someInfo: 'someInfo' }
logger.info(`Some info about processing cool object with id ${object.id}`, object } });
```

At your console, the logs now contain the trace-id identifier:

```sh
[info] Some info about processing cool object with id 11 [trace-id: TRACER-ID] { extra: { id: 11, someInfo: 'someInfo' } }, module: 'path/to/my/file.js', timestamp: '2020-06-09T22:46:21.759Z'}
```

## TODO

- Create Express Middleware Request Logger
