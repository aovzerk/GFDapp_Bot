/* eslint-disable max-nested-callbacks */
const { Player, RepeatMode } = require("discord-music-player");
const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
class Music_analys extends Player {
	constructor(Bot, options) {
		super(Bot, options);
		this.guilds = new Map();
		this.intervals = new Map();
		this.callbacks = new Map();
		this.action_row = new MessageActionRow()
			.addComponents(
				new MessageButton()
					.setCustomId("next_song")
					.setLabel("Следующий трек")
					.setStyle("PRIMARY"),
				new MessageButton()
					.setCustomId("pause_song")
					.setLabel("Пауза")
					.setStyle("PRIMARY"),
				new MessageButton()
					.setCustomId("queue_song")
					.setLabel("Очередь")
					.setStyle("PRIMARY"),
				new MessageButton()
					.setCustomId("update_song")
					.setLabel("Обновить")
					.setStyle("PRIMARY"),
				new MessageButton()
					.setCustomId("stop_q")
					.setLabel("Выключить муызку")
					.setStyle("PRIMARY")
			);
		this.action_row2 = new MessageActionRow()
			.addComponents(
				new MessageButton()
					.setCustomId("repeat_song")
					.setLabel("Зациклить трек")
					.setStyle("PRIMARY"),
				new MessageButton()
					.setCustomId("repeat_queue")
					.setLabel("Зациклить очередь")
					.setStyle("PRIMARY"),
				new MessageButton()
					.setCustomId("shuffle_queue")
					.setLabel("Перемешать очередь")
					.setStyle("PRIMARY")
			);
		this.ids_int = ["next_song", "pause_song", "queue_song", "update_song", "stop_q", "repeat_song", "repeat_queue", "shuffle_queue"];
		this.djs = new Map();
		this.msgs_add = new Map();
	}
	init() {
		this.set_nadlers();
	}
	destroy() {
		this.callbacks.forEach((func, event_name) => {
			this.client.removeListener(event_name, func);
		});
		this.callbacks = new Map();
	}
	reg_callback(event_name, func, once = false) {
		this.callbacks.set(event_name, func);
		if (once) {
			this.client.once(event_name, func);
		} else {
			this.client.on(event_name, func);
		}
	}
	remove_callback(event_name) {
		const callback = this.callbacks.get(event_name);
		if (callback == undefined || callback == null) return;
		this.client.removeListener(event_name, callback);
		this.callbacks.delete(event_name);
	}
	set_nadlers() {
		this.on("songFirst", (queue, song) => {
			this.update_msg(queue, song);
			// this.intervals.set(queue.guild.id, setInterval(() => this.update_msg(queue, song), 10000));
		});
		this.on("songChanged", (queue, newSong, oldSong) => {
			clearInterval(this.intervals.get(queue.guild.id));
			this.update_msg(queue, newSong);
			// this.intervals.set(queue.guild.id, setInterval(() => this.update_msg(queue, newSong), 10000));
		});
		this.on("songAdd", (queue, song) => {
			this.send_add_song(queue, song);
		});
		this.on("queueEnd", (queue) => {
			clearInterval(this.intervals.get(queue.guild.id));
			this.intervals.delete(queue.guild.id);
			this.end_message(queue);
		});
		this.on("queueDestroyed", (queue) => {
			clearInterval(this.intervals.get(queue.guild.id));
			this.intervals.delete(queue.guild.id);
			this.end_message(queue);
		});
		this.on("QUEUE_STOPED", (queue) => {
			clearInterval(this.intervals.get(queue.guild.id));
			this.intervals.delete(queue.guild.id);
			this.end_message(queue);
		});
		this.on("clientUndeafen", (queue) => {
			queue.stop();
			clearInterval(this.intervals.get(queue.guild.id));
			this.intervals.delete(queue.guild.id);
			this.end_message(queue);
		});
		this.on("error", (error, queue) => {
			clearInterval(this.intervals.get(queue.guild.id));
			this.intervals.delete(queue.guild.id);
			this.end_message(queue);
		});
		this.callback_interactionCreate = (interaction) => {
			if (!interaction.isButton()) return;
			if (!this.ids_int.includes(interaction.customId)) return;
			const queue = this.client.player.getQueue(interaction.guild.id);
			if (queue == null || queue == undefined) {
				return interaction.reply({ "content": "Этот плеер устарел используйте ``g!np``", "ephemeral": true });
			}
			const msg = this.guilds.get(queue.guild.id);
			if (msg == undefined || msg == null) {
				return interaction.reply({ "content": "Этот плеер устарел используйте ``g!np``", "ephemeral": true });
			}
			if (msg.id != interaction.message.id) {
				return interaction.reply({ "content": "Этот плеер устарел используйте ``g!np``", "ephemeral": true });
			}
			const dj = this.djs.get(interaction.guild.id);
			if (dj == null || dj == undefined) {
				return interaction.reply({ "content": "Этот плеер устарел используйте ``g!np``", "ephemeral": true });
			}
			switch (interaction.customId) {
				case "shuffle_queue":
					if (dj == interaction.member.id) {
						interaction.reply({ "content": "``Перемешал``" }).then(() => {
							interaction.fetchReply().then(_msg => {
								setTimeout(() => _msg.delete().catch(err => console.log(err)), 3000);
							});
						});
						queue.shuffle();
					} else {
						interaction.reply({ "content": "``Вы не Dj``", "ephemeral": true });
					}
					break;
				case "repeat_song":
					if (dj == interaction.member.id) {
						if (queue.repeatMode == 1) {
							interaction.reply({ "content": "``Выключил режим зацикливания трека``" }).then(() => {
								interaction.fetchReply().then(_msg => {
									setTimeout(() => _msg.delete().catch(err => console.log(err)), 3000);
								});
								queue.setRepeatMode(RepeatMode.DISABLED);
								this.update_msg(queue, queue.nowPlaying);
							});
						} else {
							interaction.reply({ "content": "``Зациклил трек``" }).then(() => {
								interaction.fetchReply().then(_msg => {
									setTimeout(() => _msg.delete().catch(err => console.log(err)), 3000);
								});
								queue.setRepeatMode(RepeatMode.SONG);
								this.update_msg(queue, queue.nowPlaying);
							});
						}
					} else {
						interaction.reply({ "content": "``Вы не Dj``", "ephemeral": true });
					}
					break;
				case "repeat_queue":
					if (dj == interaction.member.id) {
						if (queue.repeatMode == 2) {
							interaction.reply({ "content": "``Выключил режим зацикливания очереди``" }).then(() => {
								interaction.fetchReply().then(_msg => {
									setTimeout(() => _msg.delete().catch(err => console.log(err)), 3000);
								});
								queue.setRepeatMode(RepeatMode.DISABLED);
								this.update_msg(queue, queue.nowPlaying);
							});
						} else {
							interaction.reply({ "content": "``Зациклил очередь``" }).then(() => {
								interaction.fetchReply().then(_msg => {
									setTimeout(() => _msg.delete().catch(err => console.log(err)), 3000);
								});
								queue.setRepeatMode(RepeatMode.QUEUE);
								this.update_msg(queue, queue.nowPlaying);
							});
						}
					} else {
						interaction.reply({ "content": "``Вы не Dj``", "ephemeral": true });
					}
					break;
				case "next_song":
					if (dj == interaction.member.id) {
						if (queue.songs.length == 1) {
							queue.stop();
							this.emit("QUEUE_STOPED", queue);
						} else {
							interaction.reply({ "content": "``Скипаю трек``" }).then(() => {
								interaction.fetchReply().then(_msg => {
									setTimeout(() => _msg.delete().catch(err => console.log(err)), 3000);
								});
							});
							queue.skip();
						}

					} else {
						interaction.reply({ "content": "``Вы не Dj``", "ephemeral": true });
					}

					break;
				case "pause_song":
					if (queue.paused) {
						if (dj == interaction.member.id) {
							interaction.reply({ "content": "``Начинаю воспроизведение``" }).then(() => {
								interaction.fetchReply().then(_msg => {
									setTimeout(() => _msg.delete().catch(err => console.log(err)), 3000);
								});
							});
							queue.setPaused(false);
						} else {
							interaction.reply({ "content": "``Вы не Dj``", "ephemeral": true });
						}

					} else if (dj == interaction.member.id) {
						interaction.reply({ "content": "``Останавливаю воспроизведение``" }).then(() => {
							interaction.fetchReply().then(_msg => {
								setTimeout(() => _msg.delete().catch(err => console.log(err)), 3000);
							});
						});
						queue.setPaused(true);
					} else {
						interaction.reply({ "content": "``Вы не Dj``", "ephemeral": true });
					}
					break;
				case "queue_song":
					interaction.reply({ "embeds": [this.get_queue(queue)] }).then(() => {
						interaction.fetchReply().then(_msg => {
							setTimeout(() => _msg.delete().catch(err => console.log(err)), 1 * 60 * 1000);
						});
					});
					break;
				case "update_song":
					interaction.reply({ "content": "``Обновил``" }).then(() => {
						interaction.fetchReply().then(_msg => {
							setTimeout(() => _msg.delete().catch(err => console.log(err)), 3000);
						});
					});
					this.update_msg(queue, queue.nowPlaying);
					break;
				case "stop_q":
					if (dj == interaction.member.id) {
						queue.stop();
						this.emit("QUEUE_STOPED", queue);
					} else {
						interaction.reply({ "content": "``Вы не Dj``", "ephemeral": true });
					}
					break;
				default:
					break;
			}
		};

		this.client.on("interactionCreate", this.callback_interactionCreate);
	}
	get_queue(queue) {
		const embed = new MessageEmbed()
			.setTitle("Очередь");
		let description = "";
		for (let i = 0; i < queue.songs.length; i++) {
			if (i == 10) break;
			const song = queue.songs[i];
			description = `${description }\`\`${ song.name }\`\`` + ` - ${ song.requestedBy.toString()}\n`;
		}
		embed.setDescription(description);
		embed.setFooter({
			"text": `Всего треков ${queue.songs.length}`
		});
		return embed;
	}
	send_add_song(queue, song) {
		const msg = this.guilds.get(queue.guild.id);
		if (msg == undefined || msg == null) return;
		const embed = new MessageEmbed()
			.setTitle("Добавлен трек в очередь")
			.setDescription(`[${song.name}](${song.url})`);
		msg.channel.send({ "embeds": [embed] }).then(new_msg => {
			setTimeout(() => new_msg.delete().catch(err => console.log(err)), 5000);
		});
	}
	end_message(queue) {
		const msg = this.guilds.get(queue.guild.id);
		if (msg == undefined || msg == null) return;
		if (!queue.destroyed && queue.songs.length != 0) {
			queue.setPaused(false);

		}
		if (!queue.destroyed) {
			// queue.leave();
			// queue.stop();
		}
		msg.edit({ "content": "``Очередь закончилась либо остановили воспроизведение, прекращаю играть музыку``", "embeds": [], "components": [] }).then(() => {
			this.guilds.delete(queue.guild.id);
			setTimeout(() => msg.delete().catch(err => console.log(err)), 5000);
		});

	}
	update_msg(_queue, song) {
		const queue = this.client.player.getQueue(_queue.guild.id);
		if (queue.songs.length == 0 || queue.destroyed) return this.end_message(queue);
		clearInterval(this.intervals.get(queue.guild.id));
		const msg = this.guilds.get(queue.guild.id);
		if (msg == undefined || msg == null) return;
		let mode = "";
		switch (queue.repeatMode) {
			case 0:
				mode = "OFF";
				break;
			case 1:
				mode = "SONG";
				break;
			case 2:
				mode = "QUEUE";
				break;
			default:
				break;
		}
		try {
			const ProgressBar = queue.createProgressBar();
			const options = {
				"title": song.name,
				"description": `${song.author}\nРежим повтора: ${mode}`,
				"url": song.url,
				"thumbnail": {
					"url": song.thumbnail
				},
				"fields": [
					{
						"name": "Статус",
						"value": `\`\`${ProgressBar.prettier}\`\``
					}
				]
			};
			const embed = new MessageEmbed(options);
			msg.edit({ "content": "Играю", "embeds": [embed], "components": [this.action_row, this.action_row2] });
		} catch (error) {
			const options = {
				"title": song.name,
				"description": `${song.author}\nРежим повтора: ${mode}`,
				"url": song.url,
				"thumbnail": {
					"url": song.thumbnail
				}
			};
			const embed = new MessageEmbed(options);
			msg.edit({ "content": "Играю", "embeds": [embed] });
			this.intervals.set(queue.guild.id, setInterval(() => this.update_msg(queue, song), 10000));
		}


	}
}
module.exports = (Bot) => {
	if (Bot.player) {
		Bot.removeListener("interactionCreate", Bot.player.callback_interactionCreate);

		Bot.player.destroy();
		Bot.player.queues.forEach(queue => {
			if (!queue.destroyed) {
				// queue.leave();
				queue.stop();
				Bot.player.emit("QUEUE_STOPED", queue);
			}
			// queue.stop();
			// queue.leave();

		});

	}
	const player = new Music_analys(Bot, {
		"leaveOnEnd": true,
		"leaveOnStop": true,
		"leaveOnEmpty": true,
		"volume": 100,
		"quality": "high"
	});
	Bot.player = player;
	Bot.player.init();
};