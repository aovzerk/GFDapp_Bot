const SDC = require("../../sdc-api-master");
class SDC_auto_post extends SDC {
	constructor(token, Bot) {
		super(token);
		this.Bot = Bot;
		this.callbacks = new Map();
	}
	destroy() {
		this.callbacks.forEach((func, event_name) => {
			this.Bot.removeListener(event_name, func);
		});
		this.callbacks = new Map();
	}
	reg_callback(event_name, func, once = false) {
		this.callbacks.set(event_name, func);
		if (once) {
			this.Bot.once(event_name, func);
		} else {
			this.Bot.on(event_name, func);
		}
	}
	remove_callback(event_name) {
		const callback = this.callbacks.get(event_name);
		if (callback == undefined || callback == null) return;
		this.Bot.removeListener(event_name, callback);
		this.callbacks.delete(event_name);
	}
	init() {
		this.set_handler();
	}
	set_handler() {
		const call_back_ready = (Client) => {
			this.setAutoPost(Client);
		};

		this.reg_callback("ready", call_back_ready, true);
	}
}
module.exports = (Bot) => {
	if (Bot.SDC_auto_post) {
		Bot.SDC_auto_post.destroy();
	}
	Bot.SDC_auto_post = new SDC_auto_post(global.main_config.SDC_API, Bot);
	Bot.SDC_auto_post.init();
};