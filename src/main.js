const winston = require('winston');
const Sentry = require('raven');

function getLogger() {
  const transports = [
    new winston.transports.Console({
      level: 'silly',
      format: winston.format.timestamp(),
      stderrLevels: ['error'],
      consoleWarnLevels: ['warn']
    }),
  ];

  if (process.env.SENTRY_DSN) {
    transports.push(new Sentry.Client({
      dsn: process.env.SENTRY_DSN,
      tags: {
        app: process.env.SENTRY_APP,
        environment: process.env.SENTRY_ENVIRONMENT,
      },
      release: process.env.SENTRY_RELEASE,
    }));
  }

  return winston.createLogger({ transports });
}

module.exports = getLogger;
