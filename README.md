## [git repository](https://github.com/maidol/cw-logger/tree/es6)

## cw logger2 sample (es6分支)

## cw-logger2@3.0.0 支持阿里云kafka

```bash
cd sample
node test.js
```

## How to use

## Install

To install via [npm](https://www.npmjs.com/package/cw-logger2)

```bash
npm install cw-logger2 --save
```

## Using
------
默认提供名称为console和app的logger的访问属性, 其他自定义名称的logger通过log.getLogger(${name})获取

```javascript
const config = {
	logRoot: require('path').resolve(__dirname, './logs'), // 日志根目录(需根据实际情况设置)
	logLevel: 'info', // file
	logLevel4console: 'error', // console
	bunyan: {
		// 级别分别是: TRACE DEBUG INFO WARN ERROR FATAL
		categorys: [{
				name: 'console',
				type: 'console',
				logLevel4console: 'error',
				pretty: true, // 格式化console输出日志, 方便查看
				src: true // 开启代码行定位
			},{
				name: 'app', // 模块/分类
				type: 'rotatingFile',
				pretty: true, // 格式化console输出日志, 方便查看
				src: false,
				// logLevel: 'info',
				// logLevel4console: 'error',
				rotateConfig: {
					period: '1d', // The period at which to rotate.
					threshold: '10m', // Rotate log files larger than 10 megabytes
					totalFiles: 10 //The maximum number of rotated files to keep. 0 to keep files regardless of how many there are.
				}
			},{
				name: 'login', // 模块/分类
				type: 'rotatingFile',
				pretty: true, // 格式化console输出日志, 方便查看
				// logLevel: 'info',
				// logLevel4console: 'error',
				rotateConfig: {
					period: '1d', // The period at which to rotate.
					threshold: '10m', // Rotate log files larger than 10 megabytes
					totalFiles: 0 //The maximum number of rotated files to keep. 0 to keep files regardless of how many there are.
				}
			}
		]
	}
};
const CwLogger = require('cw-logger2');
const log = new CwLogger(config);

// const myConsoleLogger = log.getLogger('console');
// const appLogger = log.getLogger('app');
// const loginLogger = log.getLogger('login');

const myConsoleLogger = log.console;
const appLogger = log.app;
const loginLogger = log.getLogger('login');

myConsoleLogger.info('info');
appLogger.info('info');
loginLogger.info('info');

myConsoleLogger.error(new Error('error myConsoleLogger'));
appLogger.error(new Error('error appLogger'));
loginLogger.error(new Error('error loginLogger'));
```

## elk logstash suport

在测试环境配置logstash, 启用logstash收集日志 enableLogstash4console: true; 查看[日志的地址elk](http://elk.internal.jiaofucloud.cn)
```javascript
const name = 'cw-api-gateway'; // 根据实际情况可定义为项目名称
const config = {
	logRoot: require('path').resolve(__dirname, './logs'), // 日志根目录(需根据实际情况设置)
	logLevel: 'info', // file
	logLevel4console: 'error', // console
	bunyan: {
		// 级别分别是: TRACE DEBUG INFO WARN ERROR FATAL
		categorys: [{
				name: 'console',
				type: 'console',
				logLevel4console: 'error',
				pretty: true, // 格式化console输出日志, 方便查看
				src: true
			},{
				name: 'app', // 模块/分类
				type: 'rotatingFile',
				pretty: true, // 格式化console输出日志, 方便查看
				src: false,
				// logLevel: 'info',
				// logLevel4console: 'error',
				rotateConfig: {
					period: '1d', // The period at which to rotate.
					threshold: '10m', // Rotate log files larger than 10 megabytes
					totalFiles: 10 //The maximum number of rotated files to keep. 0 to keep files regardless of how many there are.
				}
			},{
				name: 'login', // 模块/分类
				type: 'rotatingFile',
				pretty: true, // 格式化console输出日志, 方便查看
				// logLevel: 'info',
				// logLevel4console: 'error',
				rotateConfig: {
					period: '1d', // The period at which to rotate.
					threshold: '10m', // Rotate log files larger than 10 megabytes
					totalFiles: 0 //The maximum number of rotated files to keep. 0 to keep files regardless of how many there are.
				}
			}
		]
	},
	enableLogstash4console: true, // 使用elk收集日志
	currentLogstashInput: 'tcp', // tcp数据包(相比udp, 大小默认无限制)
	logstash: {
		type: name + (process.env.SITE_DOMAIN ? `-${process.env.SITE_DOMAIN}` : ''),
		udp: {
			host: '192.168.2.155',
			port: 64100,
		  type: name + (process.env.SITE_DOMAIN ? `-${process.env.SITE_DOMAIN}` : '')
		},
		tcp: {
			host: '192.168.2.155',
			port: 64756,
		  type: name + (process.env.SITE_DOMAIN ? `-${process.env.SITE_DOMAIN}` : '')
		}
	},
}
```

## stdout suport pretty format

```js
// 不保证性能, 建议只在开发环境开启pretty, 在生产环境关闭(或者设置logLevel4console为error以上)
// 设置pretty
{
	pretty: true // 格式化console输出日志, 方便查看
}
```

## aliyun kafka mq suport

```javascript
const config = {
	logRoot: require('path').resolve(__dirname, './logs'), // 日志根目录(需根据实际情况设置)
	logLevel: 'info', // file
	logLevel4console: 'error', // console
	...
	...
	...
	enableKafka: true, // 会优先开启(kafka > logstash)
	kafka: {
		logproject: 'epaper',
		logstore: 'cw-logger',
		topic: 'cw-logger',
		opts: {
			'ssl_ca_location': __dirname + '/ca-cert',
			'sasl_plain_username': process.env.KAFKA_SASL_PLAIN_USERNAME,
			'sasl_plain_password': process.env.KAFKA_SASL_PLAIN_PASSWORD,
			'bootstrap_servers': ["kafka-ons-internet.aliyun.com:8080"],
		},
	},
}
```

## License

[MIT](./LICENSE.txt).
