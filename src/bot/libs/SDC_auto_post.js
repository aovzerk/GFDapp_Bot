const SDC = require("../../sdc-api-master");
class SDC_auto_post extends SDC {
	constructor(token, Bot) {
		super(token);
		this.Bot = Bot;
	}
	init() {
		this.set_handler();
	}
	set_handler() {
		this.Bot.once("ready", (Client) => {
			this.setAutoPost(Client);
		});
	}
}
module.exports = (Bot) => {
	Bot.SDC_auto_post = new SDC_auto_post(global.main_config.SDC_API, Bot);
	Bot.SDC_auto_post.init();
};