const Base_Command = require("./Class_Command/Base_Command");
const { MessageEmbed } = require("discord.js");
const name_command = "add_roles_voice";
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
			args.server_db.set("roles_add_voice", null);
			args.server_db.save();
			embed.setDescription("Выдача ролей при заходе в голос выключена");
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
		let description = "Установлены следующие роли при заходе в голосовой канал: ";
		roles.forEach(role_id => {
			description = `${description }<@&${ role_id }>, `;
		});
		const _roles_str = roles.join(",");
		args.server_db.set("roles_add_voice", _roles_str);
		embed.setDescription(description);
		args.msg.reply({ "embeds": [embed] });
		args.server_db.save();
	}
}
module.exports = new Command(description_command);