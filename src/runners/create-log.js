const BEE = require('@beyond-js/bee');

BEE('http://localhost:7000', { inspect: 4000 });

(async () => {
	try {
		var { Logger } = await bimport('@beyond-js/logs/main');

		const id = `myLog-1`;
		const logger = new Logger(id);

		// Adding a log entry
		// await logger.add('This is a log message', 'INFO');

		// Adding a log entry
		// const error = { id: 1, name: 'this is a error info' };
		// await logger.add(error, 'ERROR');

		// Retrieving log entries
		const entries = await logger.get();
		console.log(entries);
	} catch (exc) {
		console.error(exc);
	}
})();
