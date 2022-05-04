/* eslint-disable max-nested-callbacks */
const Base_Command = require("./Class_Command/Base_Command");
const name_command = "seek";
const description_command = global.config_cmd[name_command];
const ms = require("ms");

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
		args.msg.delete().catch(err => console.log(err));
		const guildQueue = args.Bot.player.getQueue(args.msg.guild.id);
		if (guildQueue == undefined || guildQueue == null) {
			args.msg.channel.send({ "content": "``В настоящее время ничего не воспроизводиться``" }).then(msg => {
				setTimeout(() => msg.delete(), 5000);
			});
		} else {
			const dj = args.Bot.player.djs.get(args.msg.guild.id);
			if (dj == args.msg.member.id) {
				if (args.args[1] == "" || args.args[1] == null) return args.msg.channel.send({ "content": "``Неверные аргументы``" }).then(msg => {
					setTimeout(() => msg.delete(), 5000);
				});
				const time = ms(args.args[1]);
				if (time == undefined || time == null) return args.msg.channel.send({ "content": "``Неверные аргументы``" }).then(msg => {
					setTimeout(() => msg.delete(), 5000);
				});
				guildQueue.seek(time);
				args.msg.channel.send({ "content": `\`\`Перемотал на ${args.args[1]}\`\`` }).then(msg => {
					setTimeout(() => msg.delete(), 5000);
				});
			} else {
				args.msg.channel.send({ "content": "``Вы не Dj``" }).then(msg => {
					setTimeout(() => msg.delete(), 5000);
				});
			}
		}
	}


}
module.exports = new Command(description_command);