/* eslint-disable max-nested-callbacks */
const Base_Command = require("./Class_Command/Base_Command");
const name_command = "bot_stat";
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
		const servers = args.Bot.guilds.cache.size;
		let users = 0;
		args.Bot.guilds.cache.forEach((guild) => {
			users += guild.memberCount;
		});
		this.sendEmbed({ "mess": args.msg, "description": `Обслуживаю юзеров: \`\`${users}\`\`\nОбслуживаю серверов: \`\`${servers}\`\``, "title": "Статистика бота" });
	}

}
module.exports = new Command(description_command);