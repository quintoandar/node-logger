const { transports, format, createLogger } = require('winston');
const Sentry = require('winston-raven-sentry');

function getLogger(mod) {
  const path = mod.filename.split('/').slice(-2).join('/');
  const winstonTransports = [
    new transports.Console({
      format: format.combine(
        format.align(),
        format.metadata(),
        format.label({ label: path }),
        format.colorize(),
        format.timestamp(),
        format.simple(),
      ),
      level: process.env.CONSOLE_LOG_LEVEL || 'info',
      stderrLevels: ['error'],
    }),
  ];

  if (process.env.SENTRY_DSN) {
    winstonTransports.push(new Sentry({
      level: 'warn',
      dsn: process.env.SENTRY_DSN,
      tags: {
        app: process.env.SENTRY_APP,
        environment: process.env.SENTRY_ENVIRONMENT,
      },
      config: {
        captureUnhandledRejections: process.env.CAPTURE_UNHANDLED_REJECTIONS || false,
      },
      release: process.env.SENTRY_RELEASE,
      install: true,
    }));
  }

  return createLogger({
    transports: winstonTransports,
  });
}

module.exports = {
  getLogger,
};
