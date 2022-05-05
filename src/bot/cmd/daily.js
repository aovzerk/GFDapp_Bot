/* eslint-disable max-nested-callbacks */
const { MessageEmbed } = require("discord.js");
const Base_Command = require("./Class_Command/Base_Command");
const name_command = "daily";
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
		this.hour_4 = 4 * 60 * 60 * 1000;
	}
	run(args) {
		args.Bot.Db_manager.get_member(args.msg.member).then(member_db => {
			if (member_db == null) {
				const prefix = args.server_db.get("prefix");
				args.msg.channel.send({ "content": `\`\`Вы не зарегестрированы в банке, используйте команду:\`\` **${prefix}reg**` }).then(msg => {
					setTimeout(() => msg.delete(), 3000);
				});
			} else {
				const next_work = Number(member_db.get("next_work"));
				const date = Date.now();
				if (next_work < date) {
					const prize = this.getRandomInt(101);
					let balance_member = Number(member_db.get("balance"));
					balance_member = balance_member + prize;
					const new_date_work = date + this.hour_4;
					member_db.set("balance", balance_member);
					member_db.set("next_work", new_date_work);
					member_db.save().then(() => {
						const embed = new MessageEmbed()
							.setDescription(`${member_db.member.toString()} получил \`\`${prize}\`\``);
						args.msg.channel.send({ "embeds": [embed] }).then(msg => {
							setTimeout(() => msg.delete(), 5000);
						});
					});
				} else {
					const embed = new MessageEmbed()
						.setDescription(`${member_db.member.toString()}, вы сможете получить награду: <t:${Math.round(next_work / 1000)}:R>`);
					args.msg.channel.send({ "embeds": [embed] }).then(msg => {
						setTimeout(() => msg.delete(), 5000);
					});
				}
			}
		});
	}
	getRandomInt(max) {
		return Math.floor(Math.random() * max);
	}


}
module.exports = new Command(description_command);