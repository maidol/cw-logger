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

}

declare interface Logger {

  debug(...args): void;

  info(...args): void;

  error(...args): void;

}

export = CwLogger; 

declare module CwLogger { }
