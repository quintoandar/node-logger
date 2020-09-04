declare module quintoandar_logger {

    type Sentry = import('@sentry/node').Sentry
    type SentryParams = import('@sentry/node').NodeOptions

    type LoggerMethod = import('winston').LeveledLogMethod
    type LogLevels = "error" | "warn" | "debug" | "info"
    type Logger = Record<LogLevels, LoggerMethod>

    type SentryFunc = undefined | ((Sentry) => void)
    type TracerBase = {
        readonly active: boolean;
    }


    function getLogger(mod: NodeModule): Logger
    function setTracer(newTracer: TracerBase): QuintoLogger
    function startSentry(newSentryParams: SentryParams, sentryFunc: SentryFunc): QuintoLogger
    interface QuintoLogger {
        getLogger: typeof getLogger
        setTracer: typeof setTracer
        startSentry: typeof startSentry
    }
}
export = quintoandar_logger
