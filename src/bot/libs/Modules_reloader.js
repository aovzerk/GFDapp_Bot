const importFresh = require("import-fresh");
class Modules_reloader {
	constructor(Bot) {
		this.Bot = Bot;
	}
	init() {
		this.set_handler();
	}
	set_handler() {
		this.Bot.on("messageCreate", (msg) => {
			if (!msg.client.Start || (msg.member && msg.member.id && msg.member.id != global.main_config.bot_admin_user_id)) return;
			if (msg.content == "g!reload cmd") {
				msg.delete();
				global.main_config = importFresh("../../../configs/main_config.json");
				global.config_cmd = importFresh("../../../configs/config_cmd");
				global.config_slash = importFresh("../../../configs/config_slash.json");
				msg.client.Loader_base_modules.init_commands();
				msg.channel.send({ "content": "Команды перезагружены" }).then(new_msg => {
					setTimeout(() => new_msg.delete(), 5000);
				});
			} else if (msg.content == "g!reload slash") {
				msg.delete();
				msg.client.Loader_base_modules.init_commands_slash();
				msg.channel.send({ "content": "Слеш команды перезагружены" }).then(new_msg => {
					setTimeout(() => new_msg.delete(), 5000);
				});
			} else if (msg.content == "g!reload libs") {
				msg.delete();
				msg.client.init_libs(1);
				msg.channel.send({ "content": "Библиотеки перезагружены" }).then(new_msg => {
					setTimeout(() => new_msg.delete(), 5000);
				});
			}
		});
	}
}
module.exports = (Bot) => {
	Bot.Modules_reloader = new Modules_reloader(Bot);
	Bot.Modules_reloader.init();
};