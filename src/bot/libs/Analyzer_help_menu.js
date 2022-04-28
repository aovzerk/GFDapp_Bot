const { MessageEmbed, MessageActionRow, MessageSelectMenu } = require("discord.js");
class Analyzer_help_menu {
	constructor(Bot) {
		this.Bot = Bot;
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
		this.select_menu = new MessageSelectMenu()
			.setCustomId("menu_help")
			.setPlaceholder("Команды")
			.setMinValues(0)
			.setMaxValues(1)
			.setOptions(options);
		this.types = new Map();
		this.types.set("info", "Команды получения информации");
		this.types.set("moder", "Команды для модерации");
		this.types.set("set_g", "Команды для настрйоки сервера");
		this.types.set("etc", "Разные команды");
		this.types.set("music", "Музыкальные команды");
		this.guilds = new Map();
	}
	init() {
		this.set_handler();
	}
	set_handler() {
		this.Bot.on("interactionCreate", (interaction) => {
			if (!interaction.isSelectMenu()) return;
			if (interaction.customId != "menu_help") return;
			const guild = this.guilds.get(interaction.guild.id);
			if (guild == undefined || guild == null) return interaction.reply({ "content": "``Вы не владелец этого сообщения``", "ephemeral": true });
			const msg_member_id = guild.get(interaction.member.id);
			if (msg_member_id == interaction.message.id) {
				interaction.client.Db_manager.get_server(interaction.guild).then((server_db) => {
					const prefix = server_db.get("prefix");
					const page = this.get_help_list(interaction.values[0], prefix);
					const title = this.types.get(interaction.values[0]);
					const embed = new MessageEmbed()
						.setTitle(title)
						.setDescription(page);
					const row = new MessageActionRow().addComponents(this.select_menu);
					interaction.update({ "embeds": [embed], "components": [row] });
				});
			} else {
				interaction.reply({ "content": "``Вы не владелец этого сообщения``", "ephemeral": true });
			}


		});
	}
	get_help_list(type, prefix) {
		let description = "";
		this.Bot.commands.forEach((value) => {
			if (value.description.type == type && value.description.visibility) {
				description = `${description }\`\`${ prefix }${value.description.name }\`\`` + "-" + `**${ value.description.description }**\n`;
			}
		});
		if (description != "") description = `${description }\n\n`;
		this.Bot.commands_slash.forEach((value) => {
			if (value.description.type == type && value.description.visibility) {
				description = `${description }\`\`/${value.description.name }\`\`` + "-" + `**${ value.description.description }**\n`;
			}
		});
		return description;
	}
}
module.exports = (Bot) => {
	Bot.Analyzer_help_menu = new Analyzer_help_menu(Bot);
	Bot.Analyzer_help_menu.init();
};