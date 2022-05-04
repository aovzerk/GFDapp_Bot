/* eslint-disable max-nested-callbacks */
const Base_Command = require("./Class_Command/Base_Command");
const name_command = "reg";
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
		this.hour_4 = 4 * 60 * 60 * 1000;
	}
	run(args) {
		args.Bot.Db_manager.get_member(args.msg.member).then(member_db => {
			if (member_db == null) {
				args.Bot.Db_manager.create_member(args.msg.member).then(() => {
					args.msg.channel.send({ "content": "Регистрация в банке успешна" }).then(msg => {
						setTimeout(() => msg.delete(), 3000);
					});
				});
			} else {
				args.msg.channel.send({ "content": "``Вы уже зарегестрированы в банке``" }).then(msg => {
					setTimeout(() => msg.delete(), 3000);
				});
			}
		});
	}
	getRandomInt(max) {
		return Math.floor(Math.random() * max);
	}


}
module.exports = new Command(description_command);