/**
 * 日志类
 */
declare class CwLogger {

  private constructor(config: Object);

  /**
   * 获取
   * @param name 
   */
  getLogger(name: String): Logger;

}

declare interface Logger {

  info(): void;

  warn(): void;

}

export = CwLogger; 

declare module CwLogger { }
