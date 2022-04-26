const Base_Command = require("./Class_Command/Base_Command");
const { MessageEmbed, MessageActionRow, MessageSelectMenu } = require("discord.js");
const name_command = "select_roles";
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
		if (!this.check_admin(args.msg.guild.me)) {
			return this.sendError({ "description_error": "У **Бота** нет прав **Администратора**", "mess": args.msg });
		}
		const embed = new MessageEmbed();
		if (args.args[1] == "") {
			embed.setDescription("Ошибка, нет аргументов");
			args.msg.reply({ "embeds": [embed] });
			return;
		}
		const roles = [];
		const invalid_role = [];
		args.args.forEach((role, i) => {
			if (i > 0 && i < args.args.length - 1) {
				const role_id = role.replace("<@&", "").replace(">", "");
				const is_role = this.chech_role(role_id, args.msg.guild);
				if (is_role) {
					roles.push(role_id);
				} else {
					invalid_role.push(role);
				}
			}
		});
		if (invalid_role.length != 0) {
			let description = "таких ролей нет на сервере: ";
			invalid_role.forEach(role => {
				description = `${description + role }, `;
			});
			embed.setDescription(description);
			args.msg.reply({ "embeds": [embed] });
			return;
		}
		const selected_menu = new MessageSelectMenu()
			.setCustomId("menu_role")
			.setPlaceholder("Нажми что бы выбрать роль")
			.setMinValues(0)
			.setMaxValues(roles.length);
		const options = [];
		roles.forEach((role_id) => {
			const role = args.msg.guild.roles.cache.get(role_id);
			options.push({ "label": `${role.name}`, "value": `${role.id}` });
		});
		selected_menu.setOptions(options);
		const row = new MessageActionRow().addComponents(selected_menu);
		args.msg.channel.send({ "content": "Выбери себе роль", "components": [row] });

	}
}
module.exports = new Command(description_command);