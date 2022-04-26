
const Base_Command = require("./Class_Command/Base_Command");
const name_command = "url";
const description_command = global.config_slash[name_command];

/*
----args----

    "Bot" - сам бот
	"inter" - interaction которое вызвало эту функцию
	"server_db" - серверв в базе данных
---
*/

class Command extends Base_Command {
	constructor(description) {
		super(description);// GIVE_PERM
	}
	run(args) {
		const url = args.inter.options.getString("url");
		const url2 = args.inter.options.getString("url2") == null ? "" : args.inter.options.getString("url2");
		const url3 = args.inter.options.getString("url3") == null ? "" : args.inter.options.getString("url3");
		const url4 = args.inter.options.getString("url4") == null ? "" : args.inter.options.getString("url4");
		if (args.Bot.Anti_url.test_str(url) != null && args.Bot.Anti_url.test_str(url2) != null && args.Bot.Anti_url.test_str(url3) != null && args.Bot.Anti_url.test_str(url4) != null) {
			args.inter.reply({ "content": `${url}\n${url2}\n${url3}\n${url4}\n` });
		} else {
			args.inter.reply({ "content": "То, что вы пытаетесь скинуть не похоже на ссылку", "ephemeral": true });
		}
	}
}
module.exports = new Command(description_command);