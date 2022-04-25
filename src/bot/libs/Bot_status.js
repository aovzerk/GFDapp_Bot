class Bot_status {
	constructor(Bot) {
		this.Bot = Bot;
		this.interval = null;
	}
	init() {
		this.set_handler();
	}
	set_handler() {
		this.Bot.once("ready", () => {
			this.set_activity();
			this.set_interval();
		});
		this.Bot.on("guildCreate", (guild) => {
			clearInterval(this.interval);
			this.set_interval();
			this.set_activity();
		});
		this.Bot.on("guildDelete", (guild) => {
			clearInterval(this.interval);
			this.set_interval();
			this.set_activity();
		});
	}
	set_activity() {
		const servers = this.Bot.guilds.cache.size;
		this.Bot.user.setActivity(`${servers} Серверов`, {
			"type": "WATCHING"
		});
	}
	set_interval() {
		this.interval = setInterval(() => this.set_activity(), 10 * 60 * 1000);
	}
}
module.exports = (Bot) => {
	Bot.Bot_status = new Bot_status(Bot);
	Bot.Bot_status.init();
};