declare module quintoandar_logger {

    type LoggerMethod = import('winston').LeveledLogMethod
    type LogLevels = "error" | "warn" | "debug" | "info"
    type Logger = Record<LogLevels, LoggerMethod>

    type TracerBase = {
        readonly active: boolean;
    }
    function getLogger(mod: NodeModule): Logger
    function setTracer(newTracer: TracerBase): QuintoLogger
    interface QuintoLogger {
        getLogger: typeof getLogger
        setTracer: typeof setTracer
    }
}
export = quintoandar_logger
