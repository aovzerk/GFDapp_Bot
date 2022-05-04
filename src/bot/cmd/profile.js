/* eslint-disable max-nested-callbacks */
const { MessageEmbed } = require("discord.js");
const Base_Command = require("./Class_Command/Base_Command");
const name_command = "profile";
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
		let member_for_embed = null;
		if (args.args[1] == "") {
			member_for_embed = args.msg.member;
		} else {
			const user_id = args.args[1].replace("<@", "").replace("!", "").replace(">", "");
			return args.msg.guild.members.fetch(user_id).then(f_member => {
				member_for_embed = f_member;
				this.get_embed(args.Bot, member_for_embed).then(embed => {
					args.msg.channel.send({ "embeds": [embed] });
				});
			}).catch(err => {
				const embed = new MessageEmbed()
					.setDescription("Юзер не найден");
				return args.msg.channel.send({ "embeds": [embed] }).then(msg => {
					setTimeout(() => msg.delete, 5000);
				});
			});

		}
		this.get_embed(args.Bot, member_for_embed).then(embed => {
			args.msg.channel.send({ "embeds": [embed] });
		});
	}
	get_embed(bot, member) {
		return new Promise((resolve, reject) => {
			bot.Db_manager.get_member(member).then(member_db => {
				member.user.fetch().then(user => {
					const options = {
						"description": `Информация об ${member.toString()}`,
						"fields": [
							{
								"name": "Высшая роль",
								"value": member.roles.highest.toString()
							},
							{
								"name": "Аккаунте создан",
								"value": `<t:${Math.round(member.user.createdTimestamp / 1000)}:R>`,
								"inline": true
							},
							{
								"name": "Зашел на север",
								"value": `<t:${Math.round(member.joinedTimestamp / 1000)}:R>`,
								"inline": true
							},
							{
								"name": "ID",
								"value": `\`\`\`Diff\n- ${member.id}\n\`\`\``
							}
						]
					};
					if (user.avatar != null) {
						options.thumbnail = { "url": user.avatarURL({ "size": 1024, "dynamic": true }) };
					}
					if (user.banner != null) {
						options.image = { "url": user.bannerURL({ "size": 1024, "dynamic": true }) };
					}
					if (member_db != null || member_db != undefined) {
						options.fields.push({
							"name": "Баланс",
							"value": `\`\`\`yaml\n${member_db.get("balance")}\n\`\`\``
						});
					}
					resolve(new MessageEmbed(options));
				});
			});
		});

	}
}
module.exports = new Command(description_command);