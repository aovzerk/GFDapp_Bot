const { MessageEmbed } = require("discord.js");
const Base_Command = require("./Class_Command/Base_Command");
const name_command = "anti_spam";
const description_command = global.config_slash[name_command];

/*
----args----

    "Bot" - сам бот
	"inter" - interaction которое вызвало эту функцию
	"server_db" - серверв в базе данных
---
*/

class Command extends Base_Command {
	constructor(description) {
		super(description);// GIVE_PERM
	}
	run(args) {
		const embed = new MessageEmbed();
		if (!this.check_admin(args.inter.member)) {
			embed.setDescription("У вас нет права **Администратор**");
			return args.inter.reply({ "embeds": [embed], "ephemeral": true });
		}
		const status_anti_spam = args.inter.options.getInteger("status");
		const anti_spam_opts = Number(args.server_db.get("anti_spam"));

		if (status_anti_spam == 1) {
			if (anti_spam_opts == 1) {
				embed.setDescription("На сервере уже **включен** анти спам");
			} else if (anti_spam_opts == 0) {
				embed.setDescription("На сервере успешно **включен** анти спам");
				args.server_db.set("anti_spam", 1);
			}
		} else if (status_anti_spam == 0) {
			if (anti_spam_opts == 1) {
				embed.setDescription("На сервере успешно **выключен** анти спам");
				args.server_db.set("anti_spam", 0);
			} else if (anti_spam_opts == 0) {
				embed.setDescription("На сервере уже **выключен** анти спам");
			}
		}
		args.inter.reply({ "embeds": [embed], "ephemeral": true });
		args.server_db.save();
	}
}
module.exports = new Command(description_command);