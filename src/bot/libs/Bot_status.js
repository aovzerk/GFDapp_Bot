class Bot_status {
	constructor(Bot) {
		this.Bot = Bot;
		this.interval = null;
	}
	init() {
		this.set_handler();
	}
	set_handler() {
		const call_back_ready = () => {
			this.set_activity();
			this.set_interval();
		};
		const callback_guildCreate = (guild) => {
			clearInterval(this.interval);
			this.set_interval();
			this.set_activity();
		};
		const callback_guildDelete = (guild) => {
			clearInterval(this.interval);
			this.set_interval();
			this.set_activity();
		};

		this.Bot.removeListener("ready", call_back_ready);
		this.Bot.removeListener("guildCreate", callback_guildCreate);
		this.Bot.removeListener("guildDelete", callback_guildDelete);

		this.Bot.once("ready", call_back_ready);
		this.Bot.on("guildCreate", callback_guildCreate);
		this.Bot.on("guildDelete", callback_guildDelete);
	}
	set_activity() {
		const servers = this.Bot.guilds.cache.size;
		this.Bot.user.setActivity(`${servers} Серверов`, {
			"type": "WATCHING"
		});
	}
	set_interval() {
		clearInterval(this.interval);
		this.interval = setInterval(() => this.set_activity(), 10 * 60 * 1000);
	}
}
module.exports = (Bot) => {
	Bot.Bot_status = new Bot_status(Bot);
	Bot.Bot_status.init();
};