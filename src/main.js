const util = require('util');
const stackTrace = require('stack-trace');
const Sentry = require('@sentry/node');
const { createLogger } = require('winston');
const {
    sentryTransport,
    consoleTransport,
} = require('./transports');

const winstonTransports = [
    sentryTransport,
    consoleTransport,
];

if(process.env.SENTRY_DSN && process.env.NODE_ENV !== 'development') {
    Sentry.init({
        serverName: process.env.SENTRY_APP,
        dsn: process.env.SENTRY_DSN,
        environment: process.env.SENTRY_ENVIRONMENT,
        debug: process.env.NODE_ENV !== 'production',
        release: process.env.SENTRY_RELEASE,
    });
}

let tracer;
const prettyLogs = process.env.PRETTY_LOGS;
const winstonLogger = createLogger({
    transports: winstonTransports,
});

function getFunctionCaller(func) {
    return func.caller;
}

function getFunctionData(func) {
    const trace = stackTrace.get(func || getFunctionCaller(getFunctionData));
    const callerData = trace[0];
    const data = {
        filePath: `${callerData.getFileName()}:${callerData.getLineNumber()}:${callerData.getColumnNumber()}`,
    };

    const caller = callerData.getMethodName()
        ? `${callerData.getTypeName()}.${callerData.getMethodName()}`
        : callerData.getFunctionName();

    if (caller) {
        data.caller = caller;
    }

    return data;
}

function formatParams(params, module, funcCallerParam) {
    function formatError(err) {
        return {
            message: err.message,
            stack: err.stack,
        };
    }

    const funcCaller = funcCallerParam || {};
    const result = [];
    const metadata = {};

    if (tracer && tracer.currentRootSpan && tracer.currentRootSpan.traceId) {
        metadata.traceId = tracer.currentRootSpan.traceId;
    }

    if (typeof params[0] === 'string') {
        result[0] = params[0];
    } else if (params[0] instanceof Error) {
        result[0] = params[0].message;
        metadata.error = formatError(params[0]);
    } else {
        result[0] = util.inspect(params[0], {
            compact: prettyLogs,
            colors: prettyLogs,
            depth: null,
            breakLength: Infinity,
        });
    }

    for (let i = 1; i < params.length; i++) {
        if (params[i] instanceof Error) {
            metadata.error = formatError(params[i]);
        } else if (typeof params[i] === 'object') {
            if (!metadata.extra) {
                metadata.extra = {};
            }

            Object.assign(metadata.extra, params[i]);
        }
    }

    if(module) {
        metadata.module = module;
    }

    Object.assign(metadata, funcCaller);
    result.push(metadata);
    return result;
}

function debugAndFuncCaller(funcCaller, module, ...params) {
    const formattedParams = formatParams(params, module, funcCaller);
    winstonLogger.debug(...formattedParams);
}

function errorAndFuncCaller(funcCaller, module, ...params) {
    const formattedParams = formatParams(params, module, funcCaller);
    winstonLogger.error(...formattedParams);
}

function warnAndFuncCaller(funcCaller, module, ...params) {
    const formattedParams = formatParams(params, module, funcCaller);
    winstonLogger.warn(...formattedParams);
}

function debugLog(module, ...params) {
    if (!winstonLogger.isLevelEnabled('debug')) {
        return;
    }
    debugAndFuncCaller(getFunctionData(debugLog), module, ...params);
}

function infoLog(module, ...params) {
    if (!winstonLogger.isLevelEnabled('info')) {
        return;
    }
    const formattedParams = formatParams(params, module);
    winstonLogger.info(...formattedParams);
}

function errorLog(module, ...params) {
    if (!winstonLogger.isLevelEnabled('error')) {
        return;
    }
    errorAndFuncCaller(getFunctionData(errorLog), module, ...params);
}

function warnLog(module, ...params) {
    if (!winstonLogger.isLevelEnabled('warn')) {
        return;
    }
    warnAndFuncCaller(getFunctionData(warnLog), module, ...params);
}

const _consoleLog = console.log;
const _consoleError = console.error;
const _consoleWarn = console.warn;

const sentryMessageToAvoid = 'Sentry Logger';
const sentryMessageType = 'string';

if (process.env.NODE_ENV === 'test') {
    console.log = function (...params) {
        _consoleLog.apply(console, ['\u001b[31;1m', ...params, '\u001b[39;49m']);
        if ((typeof params[0] === sentryMessageType) && (params[0].includes(sentryMessageToAvoid))) return;
        if (!winstonLogger.isLevelEnabled('debug')) {
            return;
        }
        debugAndFuncCaller(getFunctionData(console.log), undefined, ...params);
    };

    console.error = function (...params) {
        _consoleError.apply(console, ['\u001b[31;1m', ...params, '\u001b[39;49m']);
        if ((typeof params[0] === sentryMessageType) && (params[0].includes(sentryMessageToAvoid))) return;
        if (!winstonLogger.isLevelEnabled('error')) {
            return;
        }
        errorAndFuncCaller(getFunctionData(console.error), undefined, ...params);
    };

    console.warn = function (...params) {
        _consoleWarn.apply(console, ['\u001b[31;1m', ...params, '\u001b[39;49m']);
        if ((typeof params[0] === sentryMessageType) && (params[0].includes(sentryMessageToAvoid))) return;
        if (!winstonLogger.isLevelEnabled('warn')) {
            return;
        }
        warnAndFuncCaller(getFunctionData(console.warn), undefined, ...params);
    };
}

module.exports = {
    setTracer: (newTracer) =>  {
        tracer = newTracer;
        return this;
    },
    getLogger: (mod) => {
        const module = mod.filename.split('/').slice(-2).join('/');

        return {
            error: (...params) => errorLog(module, ...params),
            warn: (...params) => warnLog(module, ...params),
            info: (...params) => infoLog(module, ...params),
            debug: (...params) => debugLog(module, ...params),
        };
    }
};
