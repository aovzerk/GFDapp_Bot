const { MessageEmbed } = require("discord.js");
const Base_Command = require("./Class_Command/Base_Command");
const name_command = "giveaways";
const description_command = global.config_slash[name_command];
const ms = require("ms");
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
		let prize = null;
		let duration = null;
		let winers = null;
		let msg_id = null;
		switch (sub_command) {
			case "start":
				prize = args.inter.options.getString("prize");
				winers = Number(args.inter.options.getInteger("winers"));
				duration = ms(args.inter.options.getString("duration"));
				if (duration == undefined || duration == null) {
					embed.setDescription("Не верное значение в параметрах ``duration``");
				} else if (winers < 0) {
					embed.setDescription("Не верное значение в параметрах ``winers``");
				} else {
					embed.setDescription("Запускаю раздачу");
					args.Bot.Giveaways_Manager.start(args.inter.channel, {
						"duration": duration,
						"winnerCount": winers,
						"prize": prize
					});
				}
				args.inter.reply({ "embeds": [embed], "ephemeral": true });
				break;
			case "reroll":
				args.inter.deferReply({ "ephemeral": true }).then(() => {
					msg_id = args.inter.options.getString("id_msg");
					args.Bot.Giveaways_Manager.reroll(msg_id).then(() => {
						args.inter.editReply({ "content": "``Встречайте нового победителя``", "ephemeral": true });
					}).catch(() => {
						args.inter.editReply({ "content": "``Проверьте правильность id сообщения, либо розыгрышь не закончен, либо выбор нового победителя невозможен``", "ephemeral": true });
					});
				});

				break;
			default:
				break;
		}
	}
}
module.exports = new Command(description_command);