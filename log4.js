module.exports = function (opts) {
	if(global.cw_logger) return global.cw_logger;
	let cw_logger = {};

	const cw_options = opts;

	const fs = require('fs');
	const path = require('path');

	const logRoot = cw_options.logRoot; // 日志根目录

	function initLogDir(logDirs) {
		// 创建根目录
		if (!fs.existsSync(logRoot)) {
			fs.mkdirSync(logRoot);
		}

		// // 创建子目录
		// logDirs.forEach((item) => {
		// 	const childLogDir = path.resolve(logRoot, item);
		// 	if (!fs.existsSync(childLogDir)) {
		// 		fs.mkdirSync(childLogDir);
		// 	}

		// 	['info', 'error'].forEach(l=>{
		// 		let d = path.resolve(logRoot, `${item}/${l}`);
		// 		if (!fs.existsSync(d)) {
		// 			fs.mkdirSync(d);
		// 		}
		// 	});
		// });
	}

	var bunyan = require('./bunyan')(cw_options);
	var categorys = cw_options.bunyan.categorys;
	var logDirs = categorys.filter(c => c.type === 'rotatingFile').map(c => c.name);
	initLogDir(logDirs);

	categorys.forEach(item => {
		var l = bunyan.rotating(item.name, item, {
			enableLogstash4console: cw_options.enableLogstash4console,
			currentLogstashInput: cw_options.currentLogstashInput
		});
		cw_logger[item.name] = l;
		cw_logger[item.name].getLogger = function () {
			return l;
		};
	});

	var source = cw_logger;
	var obj = function (category) {
		if (!category || !source[category]) {
			throw new Error('没有找到指定的日志模块' + category);
		}
		return source[category].getLogger();
	}
	obj.getLogs = function (categoryName) {
		if (!categoryName || !source[categoryName]) {
			throw new Error('没有找到指定的日志模块' + categoryName);
		}
		return source[categoryName].getLogger()
	}
	for (var key in cw_logger) {
		if (cw_logger.hasOwnProperty(key)) {
			obj[key] = cw_logger[key].getLogger();
			obj[key].getLogger = cw_logger[key].getLogger;
		}
	}
	global.cw_logger = cw_logger = obj;
	return cw_logger;
}