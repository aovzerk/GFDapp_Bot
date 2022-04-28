/* eslint-disable max-nested-callbacks */
const Base_Command = require("./Class_Command/Base_Command");
const name_command = "np";
const description_command = global.config_cmd[name_command];


/*
----args----

    "Bot" - сам бот
	"msg" - сообщение которое вызвало эту функцию
	"args" - аргументы этого сообщения
	"server_db" - модель сервера в базе данных

----args----
*/

class Command extends Base_Command {
	constructor(description) {
		super(description);
	}
	run(args) {
		args.msg.delete();
		const guildQueue = args.Bot.player.getQueue(args.msg.guild.id);
		if (guildQueue == undefined || guildQueue == null) {
			args.msg.channel.send({ "content": "В настоящее время ничего не воспроизводиться" }).then(msg => {
				setTimeout(() => msg.delete(), 5000);
			});
		} else {
			args.msg.channel.send({ "content": "Играю" }).then(new_msg => {
				const old_msg = args.Bot.player.guilds.get(args.msg.guild.id);
				if (old_msg != null || old_msg != undefined) {
					old_msg.delete().catch(err => {console.log(err);});
				}
				args.Bot.player.guilds.set(args.msg.guild.id, new_msg);
				const song = guildQueue.nowPlaying;
				const queue = { "guild": args.msg.guild };
				args.Bot.player.update_msg(queue, song);
			});
		}
	}


}
module.exports = new Command(description_command);