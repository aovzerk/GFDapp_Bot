const { MessageEmbed } = require("discord.js");
const Base_Command = require("./Class_Command/Base_Command");
const name_command = "auto_kick";
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
		if (!this.check_admin(args.inter.guild.me)) {
			embed.setDescription("У **Бота** нет права **Администратор**");
			return args.inter.reply({ "embeds": [embed], "ephemeral": true });
		}
		const status_auto_kick = args.inter.options.getInteger("status");
		const auto_kick_opts = Number(args.server_db.get("auto_kick"));

		if (status_auto_kick == 1) {
			if (auto_kick_opts == 1) {
				embed.setDescription("На сервере уже **включен** авто кик");
			} else if (auto_kick_opts == 0) {
				embed.setDescription("На сервере успешно **включен** авто кик");
				args.server_db.set("auto_kick", 1);
			}
		} else if (status_auto_kick == 0) {
			if (auto_kick_opts == 1) {
				embed.setDescription("На сервере успешно **выключен** авто кик");
				args.server_db.set("auto_kick", 0);
			} else if (auto_kick_opts == 0) {
				embed.setDescription("На сервере уже **выключен** авто кик");
			}
		}
		args.inter.reply({ "embeds": [embed], "ephemeral": true });
		args.server_db.save();
	}
}
module.exports = new Command(description_command);