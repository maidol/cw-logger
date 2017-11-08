var config;
var logstashConfig;
var bunyan = require('bunyan')
// var bformat = require('bunyan-format')  
// var prettyformatOut = bformat({ outputMode: 'short' });
var PrettyStream = require('bunyan-prettystream');
var prettyStdOut = new PrettyStream();
prettyStdOut.pipe(process.stdout);

var bunyan4udp = require('./logstash/udp-bunyan');
var bunyan4tcp = require('./logstash/tcp-bunyan');
var RotatingFileStream = require('bunyan-rotating-file-stream');

var getLogger4logstashUDP = function (category, options) {
  options = options || {};
  return bunyan.createLogger({
    name: category || 'logstash_udp',
    streams: [{
      level: options.logLevel4console || config.logLevel4console || 'info',
      // stream: options.pretty ? prettyformatOut : process.stdout
      stream: options.pretty ? prettyStdOut : process.stdout
    }, {
      level: options.logLevel || logstashConfig.logLevel || config.logLevel || 'info',
      type: "raw",
      stream: bunyan4udp.createStream(logstashConfig.udp)
    }],
    level: options.logLevel || config.logLevel || 'info',
    src: true
  });
}

var getLogger4logstashTCP = function (category, options) {
  options = options || {};
  return bunyan.createLogger({
    name: category || 'logstash_tcp',
    streams: [{
      level: options.logLevel4console || config.logLevel4console || 'info',
      // stream: options.pretty ? prettyformatOut : process.stdout
      stream: options.pretty ? prettyStdOut : process.stdout
    }, {
      level: options.logLevel || logstashConfig.logLevel || config.logLevel || 'info',
      type: "raw",
      stream: bunyan4tcp.createStream(logstashConfig.tcp)
    }],
    level: options.logLevel || config.logLevel || 'info',
    src: true
  });
}

var getLogger4Rotating = function (category, options, logstashOpts) {
  var workerId4prefix = config.workerId4prefix || ( process.env.pm_id === undefined ?
    "" : process.env.pm_id + "-" ); // sample: workerId4prefix = '1-' or ''
  options = options || {};
  category = category || 'rotation';
  logstashOpts = logstashOpts || {};
  var rotateConfig = options.rotateConfig || {};

  if (logstashOpts.enableLogstash4console) {
    var bunyan4logstash = getLogger4logstashUDP(category, options);;
    switch (logstashOpts.currentLogstashInput) {
      case 'tcp':
        bunyan4logstash = getLogger4logstashTCP(category, options);
        break;

      default:
        bunyan4logstash = getLogger4logstashUDP(category, options);
        break;
    }
    return bunyan4logstash;
  }

  if (category === 'console') {
    return bunyan.createLogger({
      name: category,
      streams: [{
        level: options.logLevel4console || config.logLevel4console || 'info',
        // stream: options.pretty ? prettyformatOut : process.stdout
        stream: options.pretty ? prettyStdOut : process.stdout
      }],
      level: options.logLevel || config.logLevel || 'info',
      src: true
    });
  }

  // bunyan的bug, 拼接的路径存在 %Y-%m-%d, 则动态变量必须放在固定字符串的前面或后面
  // ${workerId4prefix}%Y-%m-%d.info.log 有效
  // %Y-%m-%d.info.log${workerId4prefix} 有效
  // info${workerId4prefix}.log 有效
  // %Y-%m-%d.${workerId4prefix}info.log 无效
  return bunyan.createLogger({
    name: category || 'rotating',
    streams: [{
        level: options.logLevel4console || config.logLevel4console || 'info',
        // stream: options.pretty ? prettyformatOut : process.stdout
        stream: options.pretty ? prettyStdOut : process.stdout
      },
      {
        type: 'raw',
        level: options.logLevel || config.logLevel || 'info',
        stream: new RotatingFileStream({
          path: rotateConfig.path ? `${rotateConfig.path}/info/${workerId4prefix}%Y-%m-%d.log` : `logs/${workerId4prefix}${category}-%Y-%m-%d.log`,
          // path: 'logs/ex.%Y-%m-%d %H:%M:%S.log',
          period: rotateConfig.period || '1d', // rotation
          totalFiles: rotateConfig.totalFiles === undefined ? 10 : rotateConfig.totalFiles, // keep 10 back copies
          rotateExisting: true, // Give ourselves a clean file when we start up, based on period
          threshold: rotateConfig.threshold || '10m', // Rotate log files larger than 10 megabytes
          // totalSize: '20m', // Don't keep more than 20mb of archived log files
          gzip: false // Compress the archive log files to save space
        })
      },
      // {
      //   type: 'raw',
      //   level: 'error',
      //   stream: new RotatingFileStream({
      //     path: rotateConfig.path ?  `${rotateConfig.path}/error/${workerId4prefix}%Y-%m-%d.log` : `logs/${category}/error/${workerId4prefix}%Y-%m-%d.log`,
      //     // path: 'logs/ex.%Y-%m-%d %H:%M:%S.log',
      //     period: rotateConfig.period || '1d', // rotation
      //     totalFiles: rotateConfig.totalFiles || 15, // keep 10 back copies
      //     rotateExisting: true, // Give ourselves a clean file when we start up, based on period
      //     threshold: rotateConfig.threshold || '100m', // Rotate log files larger than 10 megabytes
      //     // totalSize: '20m', // Don't keep more than 20mb of archived log files
      //     gzip: false // Compress the archive log files to save space
      //   })
      // }
    ],
    level: options.logLevel || config.logLevel || 'info',
    src: true
  });
}

module.exports = function cwlog(options) {
  if (!options) throw new Error('请提供cw_log_config配置信息');
  config = config || options || {};
  logstashConfig = logstashConfig || config.logstash || options.logstash || {};
  return {
    logstashUDP: getLogger4logstashUDP,
    logstashTCP: getLogger4logstashTCP,
    rotating: getLogger4Rotating
  };
}