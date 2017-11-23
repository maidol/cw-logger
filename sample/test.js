const config = require('./config');
const CwLogger = require('../index');
let log = new CwLogger(config);
// log = new CwLogger(config);
// log = new CwLogger(config);

// const myConsoleLogger = log.console;
// const loginLogger = log.login;
// const appLogger = log.app;

const myConsoleLogger = log.getLogger('console');
const loginLogger = log.getLogger('login');
const appLogger = log.getLogger('app');

myConsoleLogger.debug('debug');
loginLogger.debug('debug');
appLogger.debug('debug');

myConsoleLogger.info('info');
loginLogger.info('info');
appLogger.info('info');

myConsoleLogger.error('error');
loginLogger.error('error');
appLogger.error('error');

myConsoleLogger.error(new Error('error'));
loginLogger.error(new Error('error'));
appLogger.error(new Error('error'));