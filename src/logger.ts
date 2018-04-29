export enum LOG_LEVELS {
  log,
  warn,
  error,
  none
}
const loggerFactory = (level: LOG_LEVELS = LOG_LEVELS.log) => {
  let log = (...args: any[]) => console.log(...args)
  let warn = (...args: any[]) => console.warn(...args)
  let error = (...args: any[]) => console.error(...args)
  switch (level) {
    case LOG_LEVELS.none:
      error = (...args: any[]) => null
    case LOG_LEVELS.error:
      warn = (...args: any[]) => null
    case LOG_LEVELS.warn:
      log = (...args: any[]) => null
    case LOG_LEVELS.log:
    // do nothing
  }
  return {
    log,
    warn,
    error
  }
}
export default loggerFactory
