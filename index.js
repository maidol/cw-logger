const fs = require('fs');
const path = require('path');
const mybunyan = require('./bunyan');

function initLogDir(logRoot) {
	// 创建根目录
	if (!fs.existsSync(logRoot)) {
		fs.mkdirSync(logRoot);
	}
}

class CwLogger {
	constructor(opts) {
		return this._create(opts);
	}

	_create(opts) {
		if (CwLogger._log) return CwLogger._log;

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
			this[item.name] = l;
		});

		CwLogger._log = this;
		return CwLogger._log;
	}
}

module.exports = CwLogger;