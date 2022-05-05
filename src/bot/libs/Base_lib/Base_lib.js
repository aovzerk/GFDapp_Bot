class Base_lib {
	constructor(Bot) {
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
}
module.exports = Base_lib;