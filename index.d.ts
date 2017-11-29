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

 /**
  * 默认console属性
  */
 get console(): Logger;

 /**
  * 默认app属性
  */
 get app(): Logger;

}

declare interface Logger {

  debug(...args): void;

  info(...args): void;

  error(...args): void;

}

export = CwLogger; 

declare module CwLogger { }
