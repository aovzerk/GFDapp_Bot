const { Bot } = require("./src");

global.main_config = require("./configs/main_config.json");
global.config_cmd = require("./configs/config_cmd");
global.config_slash = require("./configs/config_slash.json");

process.on("uncaughtException", (err, origin) => {
	console.error(err);
	console.error(origin);
});
process.on("unhandledRejection", (err, origin) => {
	console.error(err);
	console.error(origin);
});
const new_bot = new Bot(global.main_config.cfg_client, global.main_config.token);
new_bot.init();
