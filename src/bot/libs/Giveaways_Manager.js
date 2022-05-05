const { GiveawaysManager } = require("../../discord-giveaways");
class Giveaways extends GiveawaysManager {
	constructor(Bot, options) {
		super(Bot, options);
	}
	init() {
		//
	}
}
module.exports = (Bot) => {
	Bot.Giveaways_Manager = new Giveaways(Bot, {
		"storage": "./giveaways.json",
		"default": {
			"botsCanWin": false,
			"embedColor": "#000000",
			"embedColorEnd": "#000000",
			"reaction": "🎉"
		}
	});
	Bot.Giveaways_Manager.init();
};