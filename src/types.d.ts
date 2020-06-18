declare module quintoandar_logger {

    type LoggerMethod = import('winston').LeveledLogMethod
    type LogLevels = "error" | "warn" | "debug" | "info"
    type Logger = Record<LogLevels, LoggerMethod>
    type CurrentRootSpan = {
        traceId: string
    }
    type Tracer = {
        currentRootSpan: CurrentRootSpan
    }
    function getLogger(mod: NodeModule): Logger
    function setTracer(newTracer: Tracer): QuintoLogger
    interface QuintoLogger {
        getLogger: typeof getLogger
        setTracer: typeof setTracer
    }
}
export = quintoandar_logger
