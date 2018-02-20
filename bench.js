var pkg = require('./package.json'),
	sum = require('./hash-sum');

function measure(name, fn, arg) {
	console.time(name);
	fn(arg);
	console.timeEnd(name);
}

measure('json',JSON.stringify, pkg);
measure('hash',sum, pkg);
measure('json',JSON.stringify, pkg);
measure('hash',sum, pkg);
measure('json',JSON.stringify, pkg);
measure('hash',sum, pkg);
measure('json',JSON.stringify, pkg);
measure('hash',sum, pkg);
measure('json',JSON.stringify, pkg);
measure('hash',sum, pkg);

