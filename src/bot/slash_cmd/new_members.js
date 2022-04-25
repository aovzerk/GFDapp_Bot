const { MessageEmbed } = require("discord.js");
const Base_Command = require("./Class_Command/Base_Command");
const name_command = "new_members";
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
		const sub_command = args.inter.options.getSubcommand();
		let channel = null;
		switch (sub_command) {
			case "enable":
				channel = args.inter.options.getChannel("channel");
				args.server_db.set("channel_new_member", channel.id);
				embed.setDescription(`Теперь оповещения о новых юхерах будут поступать в канал ${channel.toString()}`);
				break;
			case "disable":
				args.server_db.set("channel_new_member", null);
				embed.setDescription("Оповещения о новых юзерах выключены");
				break;
			default:
				break;
		}
		args.inter.reply({ "embeds": [embed], "ephemeral": true });
		args.server_db.save();
	}
}
module.exports = new Command(description_command);