const Base_Command = require("./Class_Command/Base_Command");
const name_command = "clear_cmd";
const description_command = global.config_cmd[name_command];


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
		console.clear();
	}


}
module.exports = new Command(description_command);