/* eslint-disable max-nested-callbacks */
const Base_Command = require("./Class_Command/Base_Command");
const name_command = "clear";
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
		if (!this.check_admin(args.msg.guild.me)) {
			return this.sendError({ "description_error": "У **Бота** нет прав **Администратора**", "mess": args.msg });
		}
		let num = args.args[1];
		if (!this.isNumeric(num)) {
			this.sendError({ "description_error": "Вы указали указали строку а не число", "mess": args.msg });
			return;
		}
		num = Number(num);
		if (num < 2 || num > 100) {
			this.sendError({ "description_error": "Я могу удалять минимум 2, максимум 100 сообщений", "mess": args.msg });
			return;
		}
		args.msg.channel.messages.fetch({ "limit": num }).then(msgs => {
			args.msg.channel.bulkDelete(msgs, true).then(() => {
				this.sendEmbed({ "mess": args.msg, "description": `Сообщения удалены (${num} шт.)`, "title": "Удаление сообщений", "delete": true });
			});

		});

	}
	isNumeric(n) {
		return !isNaN(parseFloat(n)) && isFinite(n);
	}

}
module.exports = new Command(description_command);