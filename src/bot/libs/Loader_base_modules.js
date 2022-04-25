const fs = require("fs");

class Loader_base_modules {
	constructor(Bot) {
		this.Bot = Bot;
		this.Bot.commands = new Map();
		this.Bot.commands_slash = new Map();
	}
	init() {
		this.init_commands();
		this.init_commands_slash();
		this.init_handlers();

	}
	init_handlers() {
		const handlers_files = fs.readdirSync("./src/bot/handlers").filter(file => file.endsWith(".js"));
		console.log("Загрузка хендлеров");
		for (const file of handlers_files) {
			const handler = require(`../handlers/${file}`);
			if (handler.once) {
				this.Bot.once(handler.name, (...args) => handler.run(...args));
				console.log(`${file} Загружен`);
			} else {
				this.Bot.on(handler.name, (...args) => handler.run(...args));
				console.log(`${file} Загружен`);
			}
		}
	}
	init_commands() {
		const comm_files = fs.readdirSync("./src/bot/cmd/").filter(file => file.endsWith(".js"));
		console.log("Загрузка команд");
		for (const file of comm_files) {
			const command = require(`../cmd/${file}`);
			if (command.description.load) {
				this.Bot.commands.set(command.description.name, command);
				console.log(`${file} Загружен`);
			}
		}
	}
	init_commands_slash() {
		const comm_files = fs.readdirSync("./src/bot/slash_cmd/").filter(file => file.endsWith(".js"));
		console.log("Загрузка слеш команд");
		for (const file of comm_files) {
			const command = require(`../slash_cmd/${file}`);
			if (command.description.load) {
				this.Bot.commands_slash.set(command.description.name, command);
				console.log(`${file} Загружен`);
			}
		}
	}
}

module.exports = (Bot) => {
	Bot.Loader_base_modules = new Loader_base_modules(Bot);
	Bot.Loader_base_modules.init();
};