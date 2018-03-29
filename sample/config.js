"use strict";
let path = require('path');

// let workerId4prefix = process.env.pm_id === undefined ?
// "" : process.env.pm_id + "-"; // sample: workerId4prefix = '1-' or ''

module.exports = {
	// workerId4prefix,
	logRoot: require('path').resolve(__dirname, './logs'), // 日志根目录(需根据实际情况设置)
	logLevel: 'info', // file
	logLevel4console: 'error', // console
	bunyan: {
		// 级别分别是: TRACE DEBUG INFO WARN ERROR FATAL
		categorys: [{
				name: 'console',
				type: 'console',
				logLevel4console: 'debug',
				pretty: true, // 格式化console输出日志, 方便查看
				src: true // 开启代码行定位
			},{
				name: 'app', // 模块/分类
				type: 'rotatingFile',
				pretty: true, // 格式化console输出日志, 方便查看
				src: false, // 开启代码行定位
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
	enableLogstash4console: false, // 使用elk收集日志
	currentLogstashInput: 'tcp', // tcp数据包(相比udp, 大小默认无限制)
	logstash: {
		type: 'cw-api-gateway' + (process.env.SITE_DOMAIN ? `-${process.env.SITE_DOMAIN}` : ''),
		udp: {
			host: '192.168.2.155',
			port: 64100,
		  type: 'cw-api-gateway' + (process.env.SITE_DOMAIN ? `-${process.env.SITE_DOMAIN}` : '')
		},
		tcp: {
			host: '192.168.2.155',
			port: 64756,
		  type: 'cw-api-gateway' + (process.env.SITE_DOMAIN ? `-${process.env.SITE_DOMAIN}` : '')
		}
	},
	enableKafka: true, // 优先开启(kafka - logstash)
	kafka: {
		logproject: 'epaper',
		logstore: 'cw-logger',
		// topic: 'cw-logger',
		topic: 'testxway',
		opts: {
			'ssl_ca_location': __dirname + '/ca-cert',
			'sasl_plain_username': process.env.KAFKA_SASL_PLAIN_USERNAME,
			'sasl_plain_password': process.env.KAFKA_SASL_PLAIN_PASSWORD,
			'bootstrap_servers': ["kafka-ons-internet.aliyun.com:8080"],
		},
	},
};