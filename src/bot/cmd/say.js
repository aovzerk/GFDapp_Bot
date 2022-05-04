/* eslint-disable max-nested-callbacks */
const Base_Command = require("./Class_Command/Base_Command");
const name_command = "say";
const description_command = global.config_cmd[name_command];
const fetch = require("node-fetch");
const { MessageEmbed } = require("discord.js");
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
		args.msg.attachments.forEach(el => {
			fetch(el.url).then(response => {
				response.json().then(json_data => {
					try {
						const embed = new MessageEmbed(json_data);
						args.msg.channel.send({ "embeds": [embed] });
					} catch (error) {
						args.msg.channel.send({ "content": "``В файле не распознано embed сообщение``" }).then(msg => {
							setTimeout(() => msg.delete(), 5000);
						});
					}
				}).catch(err => {
					args.msg.channel.send({ "content": "``В файле не распознано embed сообщение``" }).then(msg => {
						setTimeout(() => msg.delete(), 5000);
					});
				});
			});
		});
	}
}
module.exports = new Command(description_command);