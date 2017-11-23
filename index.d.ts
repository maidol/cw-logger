/**
 * 日志类
 */
declare class CwLogger {

  static _log: CwLogger;

  /**
   * 创建
   */
  _create(config: Object): CwLogger;

  private constructor(config: Object);

}
export = CwLogger;

declare module CwLogger { }
