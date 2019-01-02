const Transport = require('winston-transport');
const Sentry = require('@sentry/node');
const { isError } = require('util');

module.exports = class SentryTransport extends Transport {
  constructor({ winstonOpts, sentryOpts }) {
    super(winstonOpts);
    Sentry.init({
      ...sentryOpts,
      integrations: integrations => integrations.filter(integration => integration.name !== 'InboundFilters')
    });
  }

  log(info, callback) {
    setImmediate(() => {
      this.emit('logged', info);
    });

    Sentry.withScope((scope) => {
      // TODO: find out how to remove string array from additional data
      // related: https://github.com/getsentry/sentry-javascript/issues/1805

      // If the logging had a field "extra" that is an object, we will
      // iterate through it and add it to the scope
      if (info.extra && typeof info.extra === 'object') {
        Object.keys(info.extra).forEach(key => scope.setExtra(key, info.extra[key]));
      }

      // If the logging had a field "tags" that is an object, we will
      // iterate through it and add it to the scope
      if (info.tags && typeof info.tags === 'object') {
        Object.keys(info.tags).forEach(key => scope.setTag(key, info.tags[key]));
      }

      // Add app as a specific new tag
      scope.setTag('app', process.env.SENTRY_APP);

      // Adds fingerprint, if any (needs to be an array of strings)
      if (info.fingerprint && Array.isArray(info.fingerprint)) {
        scope.setFingerprint(info.fingerprint);
      }

      // Use captureException only if "message" is an Error object
      if (info.level === 'error' && isError(info.message)) {
        Sentry.captureException(info.message);
      } else {
        Sentry.captureMessage(info.message, Sentry.Severity.fromString(info.level));
      }
    });

    callback();
  }
};
