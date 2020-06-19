declare module quintoandar_logger {

    type LoggerMethod = import('winston').LeveledLogMethod
    type LogLevels = "error" | "warn" | "debug" | "info"
    type Logger = Record<LogLevels, LoggerMethod>

    type TracerBase = {
        readonly active: boolean;
    }
    type SentryParams = import('@sentry/node').NodeOptions

    function getLogger(mod: NodeModule): Logger
    function setTracer(newTracer: TracerBase): QuintoLogger
    function startSentry(newSentryParams: SentryParams): QuintoLogger
    interface QuintoLogger {
        getLogger: typeof getLogger
        setTracer: typeof setTracer
        startSentry: typeof startSentry
    }
}
export = quintoandar_logger
