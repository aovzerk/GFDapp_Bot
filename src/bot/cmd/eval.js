/* eslint-disable max-nested-callbacks */
const Base_Command = require("./Class_Command/Base_Command");
const name_command = "eval";
const description_command = global.config_cmd[name_command];
const fetch = require("node-fetch");

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
		if (args.msg.member.id != global.main_config.bot_admin_user_id) return;
		args.msg.attachments.forEach(async el => {
			fetch(el.url).then(async response => {

				const programm = await response.text();
				// eslint-disable-next-line no-eval
				eval(programm);
			});
		});
	}
}
module.exports = new Command(description_command);