import { LogLevel, LOG_LEVEL } from '../utilities/constants';

export interface LogFn {
  (message?: any, ...optionalParams: any[]): void;
}

export interface Logger {
  info: LogFn;
  warn: LogFn;
  error: LogFn;
}

const NO_OP: LogFn = () => {};

export class ConsoleLogger implements Logger {
  readonly info: LogFn;
  readonly warn: LogFn;
  readonly error: LogFn;

  constructor(options?: { level? : LogLevel }) {
    const { level } = options || {};

    this.error = console.error.bind(console);

    if (level === 'error') {
      this.warn = NO_OP;
      this.info = NO_OP;

      return;
    }
    
    this.warn = console.warn.bind(console);

    if (level === 'warn') {
      this.info = NO_OP;

      return;
    }

    this.info = console.log.bind(console);
  }
}

const logger = new ConsoleLogger({ level: LOG_LEVEL });

export default logger;
