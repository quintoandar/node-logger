const _ = require('lodash');
const Sentry = require('@sentry/node');
const { transports, format } = require('winston');
const Transport = require('winston-transport');
const util = require('util');

const prettyLogs = process.env.PRETTY_LOGS;
const escapeSequences = {
    separator: prettyLogs ? '\n' : ' ',
    red: '\u001b[31;1m',
    uncolorize: '\u001b[39;49m',
};

class SentryTransport extends Transport {
    constructor(options) {
        options = options || {};
        options = _.defaultsDeep(options, {
            name: 'SentryTransport',
            silent: false,
            level: process.env.SENTRY_LOGGER_LEVEL || 'warn',
            levelsMap: {
                silly: 'debug',
                verbose: 'debug',
                info: 'info',
                debug: 'debug',
                warn: 'warning',
                error: 'error',
            },
        });

        super(_.omit(options, [
            'levelsMap',
        ]));

        this._silent = options.silent;
        this._levelsMap = options.levelsMap;
    }

    log(info, next) {
        if (this.silent) return next(null, true);
        if (!(info.level in this._levelsMap)) return next(null, true);

        const thereIsErrorExtraData = info.error && (info.error instanceof Error);

        let error = {};

        if (thereIsErrorExtraData) {
            error = info.extra.error;
            info.extra.error = util.inspect(error, { showHidden: false, depth: null });
        }

        Sentry.configureScope((scope) => {
            scope.setLevel(this._levelsMap[info.level]);
            Object.entries(info)
            .filter(([ key ]) => ['extra', 'error', 'level'].includes(key) === false)
            .forEach(([ key, value ]) => {
                scope.setExtra(key, value);
            })
            info.extra && Object.entries(info.extra)
            .forEach(([ key, value ]) => {
                scope.setExtra(`extra.${key}`, value);
            })
        });

        if (thereIsErrorExtraData) {
            Sentry.setExtra(error);
            Sentry.captureMessage(error);
        }
        else Sentry.captureMessage(info.message);

        return next();
    }
}

const sentryTransport = new SentryTransport();

const fillExcept = ['message', 'level', 'label', 'traceId'];
if (process.env.NODE_ENV === 'production') {
    fillExcept.push('timestamp');
}

let loggerFormat = format.combine(
    format.timestamp(),
    format.metadata({ fillExcept }),
    format.printf((info) => {
        const metadata = info.metadata;
        let out = `[${info.level}] ${info.message}`;
        if (info.traceId) {
            out += ` [trace-id: ${info.traceId}]`;
        }

        const error = info.metadata.error;

        if (error && prettyLogs) {
            delete metadata.error;
        }

        if (Object.keys(metadata).length > 0) {
            out += escapeSequences.separator;
            out += util.inspect(metadata, {
                compact: false, colors: prettyLogs, depth: null, breakLength: Infinity,
            });
            out += escapeSequences.separator;
        }

        if (error && prettyLogs) {
            out += escapeSequences.separator;
            out += `${escapeSequences.red}${error.stack}${escapeSequences.uncolorize}`;
            out += escapeSequences.separator;
        }

        if (!prettyLogs) {
            out = out.replace(/\n/g, '').replace(/\s\s+/g, ' ');
        }

        return out;
    }),
);

if (prettyLogs) {
    loggerFormat = format.combine(
        format.colorize(),
        loggerFormat,
    );
}

const consoleTransport = new transports.Console({
    format: loggerFormat,
    level: process.env.CONSOLE_LOG_LEVEL || 'info',
    stderrLevels: ['error'],
});

module.exports = {
    sentryTransport,
    consoleTransport,
};
