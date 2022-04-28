/* eslint-disable max-nested-callbacks */
const { MessageEmbed } = require("discord.js");
const Base_Command = require("./Class_Command/Base_Command");
const name_command = "bump";
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
		const embed = new MessageEmbed()
			.setTitle("Бампы");
		const settings_bump = Number(args.server_db.get("bump"));
		if (settings_bump == 1) {
			let description = "";
			args.msg.guild.members.fetch().then(members => {
				args.Bot.Alarms_bump.white_list.forEach((value, key) => {
					const bot = members.get(key);
					if (bot) {
						switch (value[1]) {
							case "/like":
								description = `${description }\`\`${value[1]}\`\` - <t:${Math.round(Number(args.server_db.get("bump_like")) / 1000)}:R>\n`;
								break;
							case "/up":
								description = `${description }\`\`${value[1]}\`\` - <t:${Math.round(Number(args.server_db.get("bump_up")) / 1000)}:R>\n`;
								break;
							case "!bump":
								description = `${description }\`\`${value[1]}\`\` - <t:${Math.round(Number(args.server_db.get("bump_bump")) / 1000)}:R>\n`;
								break;
							case "/bump":
								description = `${description }\`\`${value[1]}\`\` - <t:${Math.round(Number(args.server_db.get("bump_dbump")) / 1000)}:R>\n`;
								break;
							default:
								break;
						}
					}
				});
				if (description == "") {
					description = "Я не нашел ботов бамперов на вашем сервере";
				}
				embed.setDescription(description);
				args.msg.channel.send({ "embeds": [embed] });
			});

		} else {
			embed.setDescription("``Не сервере не включено отслеживание бапмов``");
			args.msg.channel.send({ "embeds": [embed] });
		}


	}


}
module.exports = new Command(description_command);