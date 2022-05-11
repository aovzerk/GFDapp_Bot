const Base_lib = require("./Base_lib/Base_lib");
class Bot_status extends Base_lib {
	constructor(Bot) {
		super(Bot);
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


		this.reg_callback("ready", call_back_ready, true);
		this.reg_callback("guildCreate", callback_guildCreate);
		this.reg_callback("guildDelete", callback_guildDelete);
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
	if (Bot.Bot_status) {
		clearInterval(Bot.Bot_status.interval);
		Bot.Bot_status.destroy();
	}
	Bot.Bot_status = new Bot_status(Bot);
	Bot.Bot_status.init();
};