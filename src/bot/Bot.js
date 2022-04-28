const { Client } = require("discord.js");
const importFresh = require("import-fresh");
const fs = require("fs");
class Bot extends Client {
	constructor(cfg_client, token) {
		super(cfg_client);
		this.setMaxListeners(0);
		this.Start = false;
		this._token = () => token;
	}
	init() {
		this.init_libs(0);
		this.Start = true;
		this.login(this._token());
	}
	init_libs(mode) {
		const libs_files = fs.readdirSync("./src/bot/libs/").filter(file => file.endsWith(".js"));
		console.log("Загрузка Библиотек");
		for (const file of libs_files) {
			if (mode == 1 && (file.toString() == "Modules_reloader.js" || file.toString() == "Music_player.js")) {
				//
			} else {
				const lib = importFresh(`./libs/${file}`);
				lib(this);
				console.log(`LIB ${file} Загружен`);
			}

		}
	}
}
module.exports = Bot;