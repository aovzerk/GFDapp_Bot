/* eslint-disable max-nested-callbacks */
const Base_Command = require("./Class_Command/Base_Command");
const name_command = "p";
const description_command = global.config_cmd[name_command];
const importFresh = require("import-fresh");
const cmd_play = importFresh("./play.js");
/*
----args----

    "Bot" - сам бот
	"msg" - сообщение которое вызвало эту функцию
	"args" - аргументы этого сообщения
	"server_db" - модель сервера в базе данных

----args----
*/

class Command extends Base_Command {
	constructor(description) {
		super(description);
	}
	run(args) {
		cmd_play.run(args);
	}
}
module.exports = new Command(description_command);