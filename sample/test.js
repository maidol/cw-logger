const config = require('./config');
const log = require('../index')(config);
const myConsoleLogger = log.console;
const loginLogger = log.login;
const appLogger = log.app;

const getLogger4console = log.console.getLogger();
const getLogs4console = log.getLogs('console');

const getLogger4app = log.app.getLogger();
const getLogs4app = log.getLogs('app');

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

getLogger4console.info('info getLogger4console');
getLogs4console.info('info getLogs4console');
getLogger4console.error('info getLogger4console');
getLogs4console.error('info getLogs4console');

getLogger4app.info('info getLogger4app');
getLogs4app.info('info getLogs4app');