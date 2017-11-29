/**
 * 日志类
 */
declare class CwLogger {

 constructor(config: Object);

  /**
   * 获取logger
   * @param name 
   */
 getLogger(name: String): Logger;

 get console(): Logger;
 get app(): Logger;

}

declare interface Logger {
  trace(...args): void;
  debug(...args): void;
  info(...args): void;
  warn(...args): void;
  error(...args): void;
  fatal(...args): void;
}

export = CwLogger; 

declare module CwLogger { }
