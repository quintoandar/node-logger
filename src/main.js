const winston = require('winston');
const Sentry = require('winston-sentry');

function getLogger(mod) {
  const path = mod.filename.split('/').slice(-2).join('/');
  const transports = [
    new (winston.transports.Console)({
      timestamp: true,
      colorize: false,
      level: 'silly',
      label: path,
    }),
  ];

  if (process.env.SENTRY_DSN) {
    transports.push(new Sentry({
      level: 'warn',
      dsn: process.env.SENTRY_DSN,
      tags: {
        app: process.env.SENTRY_APP,
        environment: process.env.SENTRY_ENVIRONMENT,
      },
      release: process.env.SENTRY_RELEASE,
      patchGlobal: true,
      install: true,
    }));
  }

  return new (winston.Logger)({transports});
}

module.exports = {
  getLogger,
};
