declare module quintoandar_logger {
    type Sentry = typeof import('@sentry/node')
    type SentryParams = import('@sentry/node').NodeOptions

    type LoggerMethod = import('winston').LeveledLogMethod
    type LogLevels = "error" | "warn" | "debug" | "info"
    type Logger = Record<LogLevels, LoggerMethod>

    type SentryFunc = ((Sentry) => void)
    type TracerBase = {
        readonly active: boolean;
    }

    function getLogger(mod: NodeModule): Logger
    function setTracer(newTracer: TracerBase): QuintoLogger
    function startSentry(newSentryParams: SentryParams): QuintoLogger
    function startSentry(newSentryParams: SentryParams, sentryFunc: SentryFunc): QuintoLogger
    
    interface QuintoLogger {
        getLogger: typeof getLogger
        setTracer: typeof setTracer
        startSentry: typeof startSentry
    }
}

export = quintoandar_logger
