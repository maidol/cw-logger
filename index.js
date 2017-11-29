const fs = require('fs');
const path = require('path');
const mybunyan = require('./bunyan');

const LOG = Symbol('CwLogger#log');
const CREATE = Symbol('CwLogger#create');

function initLogDir(logRoot) {
	// 创建根目录
	if (!fs.existsSync(logRoot)) {
		fs.mkdirSync(logRoot);
	}
}

class CwLogger {
	constructor(opts) {
		return this[CREATE](opts);
	}

	getLogger(name) {
		if (!CwLogger[LOG][`_${name}`]) throw new Error(`名称为${name}的logger未配置`);
		return CwLogger[LOG][`_${name}`];
	}

	get console() {
		if (!CwLogger[LOG]['_console']) throw new Error(`名称为console的logger未配置`);
		return CwLogger[LOG]['_console'];
	}

	get app() {
		if (!CwLogger[LOG]['_app']) throw new Error(`名称为app的logger未配置`);
		return CwLogger[LOG]['_app'];
	}

	[CREATE](opts) {
		if (CwLogger[LOG]) return CwLogger[LOG];

		// 只创建一次
		const cw_options = opts;
		const bunyan = mybunyan(cw_options);
		const categorys = cw_options.bunyan.categorys;

		initLogDir(cw_options.logRoot); // 日志根目录

		categorys.forEach(item => {
			let l = bunyan.rotating(item.name, item, {
				enableLogstash4console: cw_options.enableLogstash4console,
				currentLogstashInput: cw_options.currentLogstashInput
			});
			this[`_${item.name}`] = l;
		});

		CwLogger[LOG] = this;
		return CwLogger[LOG];
	}
}

module.exports = CwLogger;