const { Client } = require("discord.js");
const fs = require("fs");
class Bot extends Client {
	constructor(cfg_client, token) {
		super(cfg_client);
		this.Start = false;
		this._token = () => token;
	}
	init() {
		this.init_libs();
		this.Start = true;
		this.login(this._token());
	}
	init_libs() {
		const libs_files = fs.readdirSync("./src/bot/libs/").filter(file => file.endsWith(".js"));
		console.log("Загрузка Библиотек");
		for (const file of libs_files) {
			const lib = require(`./libs/${file}`);
			lib(this);
			console.log(`LIB ${file} Загружен`);
		}
	}
}
module.exports = Bot;