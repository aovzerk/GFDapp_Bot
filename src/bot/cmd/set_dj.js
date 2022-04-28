/* eslint-disable max-nested-callbacks */
const Base_Command = require("./Class_Command/Base_Command");
const name_command = "set_dj";
const description_command = global.config_cmd[name_command];
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
		args.msg.delete();
		const guildQueue = args.Bot.player.getQueue(args.msg.guild.id);
		const user_id = args.args[1].replace("<", "").replace(">", "").replace("!", "").replace("@", "");
		const member = args.msg.guild.members.cache.get(user_id);
		if (member == null || member == undefined) {
			args.msg.channel.send({ "content": "Юзер не найден" }).then(msg => {
				setTimeout(() => msg.delete(), 5000);
			});
			return;
		}
		if (member.user.bot) {
			args.msg.channel.send({ "content": "Бота нельзя сделать DJ" }).then(msg => {
				setTimeout(() => msg.delete(), 5000);
			});
			return;
		}
		if (user_id == "" || user_id == null || user_id == undefined) {
			args.msg.channel.send({ "content": "Неверные аргументы" }).then(msg => {
				setTimeout(() => msg.delete(), 5000);
			});
		}
		if (guildQueue == undefined || guildQueue == null) {
			args.msg.channel.send({ "content": "В настоящее время ничего не воспроизводиться" }).then(msg => {
				setTimeout(() => msg.delete(), 5000);
			});
		} else {
			const old_dj = args.Bot.player.djs.get(args.msg.guild.id);
			if (old_dj == args.msg.member.id) {
				args.Bot.player.djs.set(args.msg.guild.id, user_id);
				const embed = new MessageEmbed()
					.setTitle("Новый Dj!")
					.setDescription(`<@${user_id}> становится диджеем`);
				args.msg.channel.send({ "embeds": [embed] }).then(msg => {
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