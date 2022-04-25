const { MessageEmbed } = require("discord.js");
const Base_Command = require("./Class_Command/Base_Command");
const name_command = "channel_stat";
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

		const status_channel_stat = args.inter.options.getInteger("status");
		const id_all = args.server_db.get("channel_stats_all");
		const id_users = args.server_db.get("channel_stats_users");
		const id_bots = args.server_db.get("channel_stats_bots");
		if (status_channel_stat == 1) {
			args.inter.deferReply({ "ephemeral": true });
			args.Bot.Update_create_channel_stats.create_channels(args.server_db, args.inter.guild).then(res => {
				if (res == true) {
					embed.setDescription("Каналы статистики включенны");
					args.inter.editReply({ "embeds": [embed], "ephemeral": true });
				}
			}).catch(err => {
				embed.setDescription("Ошибка создания каналов, проверьте права бота");
				console.log(err);
				args.inter.editReply({ "embeds": [embed], "ephemeral": true });
			});
		} else if (status_channel_stat == 0) {
			embed.setDescription("Каналы статистики больше не обновляются");
			if (id_all == null || id_users == null || id_bots == null) {
				return args.inter.reply({ "embeds": [embed], "ephemeral": true });
			} else {
				args.Bot.Update_create_channel_stats.delete_channels(args.server_db, args.inter.guild);
			}
			args.inter.reply({ "embeds": [embed], "ephemeral": true });
		}


	}
}
module.exports = new Command(description_command);