const { MessageEmbed } = require("discord.js");
const Base_Command = require("./Class_Command/Base_Command");
const name_command = "private_channel";
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
		const status_channel_stat = args.inter.options.getInteger("status");
		const channel_privat_id = args.server_db.get("channel_privat");
		const channel_caregory_privat_id = args.server_db.get("channel_caregory_privat");
		if (status_channel_stat == 1) {
			args.inter.deferReply({ "ephemeral": true });
			args.Bot.Private_channel_system.create_channls_for_work(args.inter.guild, args.server_db).then(() => {
				embed.setDescription("Приватки включены");
				return args.inter.editReply({ "embeds": [embed], "ephemeral": true });
			});
		} else if (status_channel_stat == 0) {
			if (channel_caregory_privat_id == null || channel_privat_id == null) {
				embed.setDescription("Приватки выключены");
				return args.inter.reply({ "embeds": [embed], "ephemeral": true });
			} else {
				args.inter.deferReply({ "ephemeral": true });
				args.Bot.Private_channel_system.delete_channls_for_work(args.inter.guild, args.server_db).then(() => {
					embed.setDescription("Приватки выключены");
					return args.inter.editReply({ "embeds": [embed], "ephemeral": true });
				});
			}
		}


	}
}
module.exports = new Command(description_command);