const winston = require('winston');
const Sentry = require('raven');

const logFormat = winston.format.printf(info => {
  return `${info.timestamp} [${info.level}]: ${info.message}`;
});

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

module.exports = getLogger();
