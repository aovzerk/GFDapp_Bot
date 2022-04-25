const Base_Command = require("./Class_Command/Base_Command");
const name_command = "test";
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
		args.Bot.Db_manager.get_server(args.msg.guild).then((server) => {
			server.set("prefix", "!");
			server.save();
		});
	}


}
module.exports = new Command(description_command);