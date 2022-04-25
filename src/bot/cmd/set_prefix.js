const Base_Command = require("./Class_Command/Base_Command");
const name_command = "set_prefix";
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
		if (!this.check_admin(args.msg.member)) {
			return this.sendError({ "description_error": "У вас нет прав **Администратора**", "mess": args.msg });
		}
		if (args.args[1] == "") {
			return this.sendError({ "description_error": "Не указан аргумент(префикс)", "mess": args.msg });
		}
		args.server_db.set("prefix", args.args[1]);
		args.server_db.save().then(() => {
			this.sendEmbed({ "mess": args.msg, "description": `Установлен новый префикс \`\`${args.args[1]}\`\` для сервера \`\`${args.msg.guild.toString()}\`\``, "title": "Установлен новый префикс" });
		}).catch(err => {
			this.sendError({ "description_error": "Ошибка установки префикса, обратитесь к разработчику", "mess": args.msg });
		});

	}
}
module.exports = new Command(description_command);