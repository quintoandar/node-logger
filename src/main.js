const { transports, format, createLogger } = require('winston');
const { includeLoggerName, includeExtraData } = require('./custom-formats');
const SentryTransport = require('./sentry-transport');

const shouldAttachSentryTransport = () => process.env.SENTRY_DSN
  && process.env.SENTRY_APP && process.env.SENTRY_ENVIRONMENT;

const getLogger = (mod) => {
  const path = mod.filename.split('/').slice(-2).join('/');
  const winstonTransports = [
    new transports.Console({
      format: format.combine(
        includeExtraData(),
        includeLoggerName(path),
        format.timestamp(),
        format.json(),
      ),
      level: process.env.CONSOLE_LOG_LEVEL || 'info',
      stderrLevels: ['error'],
    }),
  ];

  if (shouldAttachSentryTransport()) {
    winstonTransports.push(new SentryTransport({
      level: process.env.SENTRY_LOG_LEVEL || 'warn',
    }));
  }

  return createLogger({
    transports: winstonTransports,
  });
};

module.exports = {
  getLogger,
};
