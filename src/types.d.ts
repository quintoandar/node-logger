declare namespace loggerBuilder {
    interface logger {
        error: (module: string, details: unknown[]) => void
        warn: (module: string, details: unknown[]) => void
        debug: (module: string, details: unknown[]) => void
        info: (module: string, details: unknown[]) => void
    }

    type currentRootSpanType = {
        traceId: string
    }
    type tracerType = {
        currentRootSpan: currentRootSpanType
    }
}

declare class loggerBuilder {
    setTracer: (newTracer: loggerBuilder.tracerType) =>void
    getLogger: (mod: string) => loggerBuilder.logger
}

export = loggerBuilder