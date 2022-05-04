const { MessageEmbed, MessageActionRow, MessageSelectMenu } = require("discord.js");
const Base_Command = require("./Class_Command/Base_Command");
const name_command = "help";
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
		super(description);// GIVE_PERM
	}
	run(args) {
		args.msg.delete();
		const options = [
			{
				"label": "Музыка",
				"description": "Музыкальные команды",
				"value": "music"
			},
			{
				"label": "Информация",
				"description": "Команды получения информации",
				"value": "info"
			},
			{
				"label": "Экономика",
				"description": "Команды экономики",
				"value": "econom"
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
		args.msg.channel.send({ "embeds": [embed], "components": [row] }).then(msg => {
			const guild = args.Bot.Analyzer_help_menu.guilds.get(msg.guild.id);
			if (guild != undefined || guild != null) {
				guild.set(args.msg.member.id, msg.id);
			} else {
				args.Bot.Analyzer_help_menu.guilds.set(msg.guild.id, new Map());
				const guild_ = args.Bot.Analyzer_help_menu.guilds.get(msg.guild.id);
				guild_.set(args.msg.member.id, msg.id);
			}
			setTimeout(() => msg.delete().catch(err => console.log(err)), 3 * 60 * 1000);
		});
	}
}
module.exports = new Command(description_command);