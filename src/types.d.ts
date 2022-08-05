declare module quintoandar_logger {
    type Sentry = typeof import('@sentry/node')
    type SentryParams = import('@sentry/node').NodeOptions

    type LoggerMethod = import('winston').LeveledLogMethod
    type LogLevels = "error" | "warn" | "debug" | "info"
    type Logger = Record<LogLevels, LoggerMethod>

    type SentryFunc = ((Sentry: Sentry) => void)
    type SentryOptions = {
        params: Record<string, string | number>
        sentryFunction?: SentryFunc
    }
    type TracerBase = {
        readonly active: boolean;
    }

    function getLogger(mod: NodeModule): Logger
    function setTracer(newTracer: TracerBase): QuintoLogger
    function startSentry(newSentryParams: SentryParams): QuintoLogger
    function startSentry(newSentryParams: SentryParams, sentryFunc: SentryFunc): QuintoLogger
    function obfuscator(content: unknown, after: string[] = [], keepList: string[] = []): unknown
    function setShouldObfuscate(obf: boolean): QuintoLogger
    function init(mod: NodeModule, sentryParams?: SentryOptions, tracer?: TracerBase, obfuscation?: boolean): QuintoLogger
    
    interface QuintoLogger {
        getLogger: typeof getLogger
        setTracer: typeof setTracer
        startSentry: typeof startSentry
        obfuscator: typeof obfuscator
        setShouldObfuscate: typeof setShouldObfuscate
        init: typeof init
    }
}

export = quintoandar_logger
