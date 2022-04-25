const Base_Command = require("./Class_Command/Base_Command");
const { MessageEmbed } = require("discord.js");
const name_command = "set_channels_read";
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
	}
	run(args) {
		if (!this.check_admin(args.msg.member)) {
			return this.sendError({ "description_error": "У вас нет прав **Администратора**", "mess": args.msg });
		}
		const embed = new MessageEmbed();
		if (args.args[1] == "") {
			args.server_db.set("channels_read_command", null);
			args.server_db.save();
			embed.setDescription("Каналы считывания сообщей сброшены");
			args.msg.reply({ "embeds": [embed] });
			return;
		}
		const channels = [];
		const invalid_channel = [];
		args.args.forEach((channel, i) => {
			if (i > 0 && i < args.args.length - 1) {
				const channel_id = channel.replace("<#", "").replace(">", "");
				const is_channel = this.chech_channel(channel_id, args.msg.guild);
				if (is_channel) {
					channels.push(channel_id);
				} else {
					invalid_channel.push(channel);
				}
			}
		});
		if (invalid_channel.length != 0) {
			let description = "таких каналов нет на сервере: ";
			invalid_channel.forEach(channel => {
				description = `${description + channel }, `;
			});
			embed.setDescription(description);
			args.msg.reply({ "embeds": [embed] });
			return;
		}
		let description = "Установлены следующие каналы для считывания команд: ";
		channels.forEach(channel_id => {
			description = `${description }<#${ channel_id }>, `;
		});
		const _channels_str = channels.join(",");
		args.server_db.set("channels_read_command", _channels_str);
		embed.setDescription(description);
		args.msg.reply({ "embeds": [embed] });
		args.server_db.save();
	}

}
module.exports = new Command(description_command);