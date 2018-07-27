const winston = require('winston');
const Sentry = require('raven');

const logFormat = winston.format.printf(info => {
  return `${info.timestamp} [${info.level}]: ${info.message}`;
});

function sentryTransport() {
  const client = new Sentry.Client({
    dsn: process.env.SENTRY_DSN,
    tags: {
      app: process.env.SENTRY_APP,
      environment: process.env.SENTRY_ENVIRONMENT,
    },
    release: process.env.SENTRY_RELEASE,
  });

  client.log = (level, msg, meta) => {
    meta = meta || {};

    extra = {
      'level': level,
      'extra': meta,
    }

    try {
      if (level == 'error') {
        if (meta instanceof Error) {
          if (msg == '') {
            msg = meta;
          } else {
            meta.message = msg + ". Cause: " + meta.message;
            msg = meta;
          }
        }
        client.captureException(msg, extra);
      } else {
        client.captureMessage(msg, extra);
      }
    } catch(err) {
      console.error(err);
    }
  }

  return client;
}

function getLogger() {
  const transports = [
    new winston.transports.Console({
      level: 'info',
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp(),
        logFormat,
      ),
      stderrLevels: ['error'],
      consoleWarnLevels: ['warn']
    }),
  ];

  if (process.env.SENTRY_DSN) {
    transports.push(sentryTransport());
  }

  return winston.createLogger({ transports });
}

module.exports = getLogger();
