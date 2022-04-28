/* eslint-disable max-nested-callbacks */
const Base_Command = require("./Class_Command/Base_Command");
const name_command = "play";
const description_command = global.config_cmd[name_command];
const { MessageEmbed } = require("discord.js");

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
		let song_request = "";
		for (let i = 1; i < args.args.length; i++) {
			song_request = `${song_request } ${ args.args[i]}`;
		}
		if (guildQueue == undefined || guildQueue == null) {
			if (!args.msg.member.voice.channel) {
				args.msg.channel.send({ "content": "``Вы не в голосовом канале``" }).then(new_msg2 => {
					setTimeout(() => new_msg2.delete(), 5000);
				});
				return;
			}
			const queue = args.Bot.player.createQueue(args.msg.guild.id);
			queue.join(args.msg.member.voice.channel).then(() => {
				args.msg.channel.send({ "content": `Ищу трек по запросу \`\`${song_request}\`\`` }).then(new_msg => {
					args.Bot.player.guilds.set(new_msg.guild.id, new_msg);
					args.Bot.player.djs.set(args.msg.guild.id, args.msg.member.id);
					queue.play(song_request, { "requestedBy": args.msg.member }).then((song) => {
						//
					}).catch((err) => {
						args.msg.channel.send({ "content": "Ошибка поиска трека" }).then(new_msg2 => {
							setTimeout(() => new_msg2.delete(), 5000);
						});
						const msg = args.Bot.player.guilds.get(args.msg.guild.id);
						msg.delete().catch(err2 => console.log(err2));
						args.Bot.player.guilds.delete(args.msg.guild.id);
						clearInterval(args.Bot.player.intervals.get(queue.guild.id));
						args.Bot.player.intervals.delete(queue.guild.id);
						if (!guildQueue)
							queue.stop();
					});
				});

			});
		} else if (args.msg.member.voice.channel && args.msg.member.voice.channel && args.msg.member.voice.channel.id == args.msg.guild.me.voice.channel.id) {
			guildQueue.play(song_request, { "requestedBy": args.msg.member }).then((song) => {
				const old_msg = args.Bot.player.guilds.get(args.msg.guild.id);
				if (old_msg.channel.id != args.msg.channel.id) {
					const embed = new MessageEmbed()
						.setTitle("Добавлен трек в очередь")
						.setDescription(`[${song.name}](${song.url})`);
					args.msg.channel.send({ "embeds": [embed] }).then(new_msg => {
						setTimeout(() => new_msg.delete(), 5000);
					});
				}

			}).catch((err) => {
				args.msg.channel.send({ "content": "Ошибка поиска трека" }).then(new_msg2 => {
					setTimeout(() => new_msg2.delete(), 5000);
				});
				if (!guildQueue)
					guildQueue.stop();
			});
		} else {
			args.msg.channel.send({ "content": "``Вы не в тоже в голосовом канале, что и бот``" }).then(new_msg2 => {
				setTimeout(() => new_msg2.delete(), 5000);
			});
		}

	}


}
module.exports = new Command(description_command);