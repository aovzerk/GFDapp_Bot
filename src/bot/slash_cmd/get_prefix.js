const Base_Command = require("./Class_Command/Base_Command");
const name_command = "get_prefix";
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
		const prefix = args.server_db.get("prefix");
		args.inter.reply({ "content": `Для сервера \`\`${args.inter.guild.toString()}\`\` установлен префикс \`\`${prefix}\`\``, "ephemeral": true });
	}
}
module.exports = new Command(description_command);