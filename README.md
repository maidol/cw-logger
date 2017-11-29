## [git repository](https://github.com/maidol/cw-logger)

## cw logger sample

```bash
cd sample
node test.js
```

## How to use

## Install

To install via [npm](https://www.npmjs.com/package/cw-logger)

```bash
npm install cw-logger --save
```

## Using

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
const log = require('cw-logger')(config);
const myConsoleLogger = log.console;
const loginLogger = log.login;
const appLogger = log.app;

myConsoleLogger.info('info');
loginLogger.info('info');
appLogger.info('info');

myConsoleLogger.error(new Error('error myConsoleLogger'));
loginLogger.error(new Error('error loginLogger'));
appLogger.error(new Error('error appLogger'));
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

## License

[MIT](./LICENSE.txt).
