declare namespace quintoandar_logger {
    interface logger {
        error: (...details: unknown[]) => void
        warn: (...details: unknown[]) => void
        debug: (...details: unknown[]) => void
        info: (...details: unknown[]) => void
    }

    type currentRootSpanType = {
        traceId: string
    }
    type tracerType = {
        currentRootSpan: currentRootSpanType
    }

    interface loggerBuilder {
        getLogger(mod: NodeModule): loggerBuilder.logger
    }
}

declare module quintoandar_logger {
    function setTracer(newTracer: quintoandar_logger.tracerType): quintoandar_logger.loggerBuilder
    function getLogger(mod: NodeModule): quintoandar_logger.logger
}

export = quintoandar_logger