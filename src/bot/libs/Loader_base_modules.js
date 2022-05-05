const importFresh = require("import-fresh");
const fs = require("fs");
const { Collection } = require("discord.js");
const Base_lib = require("./Base_lib/Base_lib");
class Loader_base_modules extends Base_lib {
	constructor(Bot) {
		super(Bot);
		this.Bot.commands = new Collection();
		this.Bot.commands_slash = new Collection();
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
			const handler = importFresh(`../handlers/${file}`);
			const callback = (...args) => handler.run(...args);
			this.reg_callback(handler.name, callback, handler.once);
			console.log(`${file} Загружен`);
		}
	}
	init_commands() {
		const comm_files = fs.readdirSync("./src/bot/cmd/").filter(file => file.endsWith(".js"));
		console.log("Загрузка команд");
		for (const file of comm_files) {
			const command = importFresh(`../cmd/${file}`);
			if (command.description.load) {
				this.Bot.commands.set(command.description.name, command);
				console.log(`${file} Загружен`);
			}
		}
		const sorted_command = this.Bot.commands.sort((a, b) => a.description.priority - b.description.priority);
		this.Bot.commands = sorted_command;
	}
	init_commands_slash() {
		const comm_files = fs.readdirSync("./src/bot/slash_cmd/").filter(file => file.endsWith(".js"));
		console.log("Загрузка слеш команд");
		for (const file of comm_files) {
			const command = importFresh(`../slash_cmd/${file}`);
			if (command.description.load) {
				this.Bot.commands_slash.set(command.description.name, command);
				console.log(`${file} Загружен`);
			}
		}
		const sorted_command = this.Bot.commands_slash.sort((a, b) => a.description.priority - b.description.priority);
		this.Bot.commands_slash = sorted_command;
	}
	reload_cmd(name) {
		const command = importFresh(`../cmd/${name}`);
		if (command.description.load) {
			this.Bot.commands.set(command.description.name, command);
			console.log(`${name} Загружен`);
		}
		const sorted_command = this.Bot.commands.sort((a, b) => a.description.priority - b.description.priority);
		this.Bot.commands = sorted_command;
	}
	reload_slash(name) {
		const command = importFresh(`../slash_cmd/${name}`);
		if (command.description.load) {
			this.Bot.commands_slash.set(command.description.name, command);
			console.log(`${name} Загружен`);
		}
		const sorted_command = this.Bot.commands_slash.sort((a, b) => a.description.priority - b.description.priority);
		this.Bot.commands_slash = sorted_command;
	}
}

module.exports = (Bot) => {
	if (Bot.Loader_base_modules) {
		Bot.Loader_base_modules.destroy();
	}
	Bot.Loader_base_modules = new Loader_base_modules(Bot);
	Bot.Loader_base_modules.init();
};