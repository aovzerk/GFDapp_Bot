const { MessageEmbed } = require("discord.js");
const Base_Command = require("./Class_Command/Base_Command");
const name_command = "guild_logs";
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
		const status_log_guild = args.inter.options.getInteger("status");
		const log_guild_opts = Number(args.server_db.get("log_guild"));

		if (status_log_guild == 1) {
			if (log_guild_opts == 1) {
				embed.setDescription("На сервере уже **включен** лог сервера");
			} else if (log_guild_opts == 0) {
				embed.setDescription("На сервере успешно **включен** лог сервера");
				args.server_db.set("log_guild", 1);
			}
		} else if (status_log_guild == 0) {
			if (log_guild_opts == 1) {
				embed.setDescription("На сервере успешно **выключен** лог сервера");
				args.server_db.set("log_guild", 0);
			} else if (log_guild_opts == 0) {
				embed.setDescription("На сервере уже **выключен** лог сервера");
			}
		}
		args.inter.reply({ "embeds": [embed], "ephemeral": true });
		args.server_db.save();
	}
}
module.exports = new Command(description_command);