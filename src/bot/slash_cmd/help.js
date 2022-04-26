const { MessageEmbed, MessageActionRow, MessageSelectMenu } = require("discord.js");
const Base_Command = require("./Class_Command/Base_Command");
const name_command = "help";
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
		const options = [
			{
				"label": "Информация",
				"description": "Команды получения информации",
				"value": "info"
			},
			{
				"label": "Модерация",
				"description": "Команды для модерации",
				"value": "moder"
			},
			{
				"label": "Настрйоки сервера",
				"description": "Команды для настрйоки сервера",
				"value": "set_g"
			},
			{
				"label": "Разное",
				"description": "Разные команды",
				"value": "etc"
			}
		];
		const select_ment = new MessageSelectMenu()
			.setCustomId("menu_help")
			.setPlaceholder("Команды")
			.setMinValues(0)
			.setMaxValues(1)
			.setOptions(options);
		const embed = new MessageEmbed()
			.setTitle("Меню бота GFDapp");
		const row = new MessageActionRow().addComponents(select_ment);
		args.inter.reply({ "embeds": [embed], "components": [row] });
	}
}
module.exports = new Command(description_command);