const config = require('./config');
const CwLogger = require('../index');
const log = new CwLogger(config);

// const myConsoleLogger = log.getLogger('console');
// const appLogger = log.getLogger('app');
// const loginLogger = log.getLogger('login');

const myConsoleLogger = log.console;
const appLogger = log.app;
const loginLogger = log.getLogger('login');

setInterval(()=>{
  myConsoleLogger.debug('debug');
  appLogger.debug('debug');
  loginLogger.debug('debug');

  myConsoleLogger.info('info');
  appLogger.info('info');
  loginLogger.info('info');

  myConsoleLogger.error('error');
  appLogger.error('error');
  loginLogger.error('error');

  myConsoleLogger.error(new Error('error'));
  appLogger.error(new Error('error'));
  loginLogger.error(new Error('error'));
}, 5000);