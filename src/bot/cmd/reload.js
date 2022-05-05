/* eslint-disable max-nested-callbacks */
const Base_Command = require("./Class_Command/Base_Command");
const importFresh = require("import-fresh");
const name_command = "reload";
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
		if (args.msg.member.id != global.main_config.bot_admin_user_id) return;
		if (args.args[1] == "lib") {
			args.msg.delete();
			const lib = importFresh(`../libs/${args.args[2]}`);
			lib(args.Bot);
			args.msg.channel.send({ "content": `\`\`LIB ${args.args[2]} Перезагружен\`\`` }).then(new_msg => {
				setTimeout(() => new_msg.delete(), 5000);
			});
			console.log(`LIB ${args.args[2]} Загружен`);
		} else if (args.args[1] == "cmds") {
			this.reload_cfg();
			args.msg.delete();
			args.msg.client.Loader_base_modules.init_commands();
			args.msg.channel.send({ "content": "``Команды перезагружены``" }).then(new_msg => {
				setTimeout(() => new_msg.delete(), 5000);
			});
		} else if (args.args[1] == "cmd") {
			this.reload_cfg();
			args.msg.delete();
			args.msg.client.Loader_base_modules.reload_cmd(args.args[2]);
			args.msg.channel.send({ "content": `\`\`Команда ${args.args[2]} перезагружены\`\`` }).then(new_msg => {
				setTimeout(() => new_msg.delete(), 5000);
			});
		} else if (args.args[1] == "slash") {
			this.reload_cfg();
			args.msg.delete();
			args.msg.client.Loader_base_modules.reload_slash(args.args[2]);
			args.msg.channel.send({ "content": `\`\`Слеш команда ${args.args[2]} перезагружены\`\`` }).then(new_msg => {
				setTimeout(() => new_msg.delete(), 5000);
			});
		} else if (args.args[1] == "slashs") {
			this.reload_cfg();
			args.msg.delete();
			args.msg.client.Loader_base_modules.init_commands_slash();
			args.msg.channel.send({ "content": "``Слеш команды перезагружены``" }).then(new_msg => {
				setTimeout(() => new_msg.delete(), 5000);
			});
		} else if (args.args[1] == "handlers") {
			this.reload_cfg();
			args.msg.delete();
			args.msg.client.Loader_base_modules.init_handlers();
			args.msg.channel.send({ "content": "``Хендлеры перезагружены``" }).then(new_msg => {
				setTimeout(() => new_msg.delete(), 5000);
			});
		}
	}
	reload_cfg() {
		global.main_config = importFresh("../../../configs/main_config.json");
		global.config_cmd = importFresh("../../../configs/config_cmd");
		global.config_slash = importFresh("../../../configs/config_slash.json");
	}
}
module.exports = new Command(description_command);