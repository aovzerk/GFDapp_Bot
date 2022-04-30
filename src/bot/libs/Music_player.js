/* eslint-disable max-nested-callbacks */
const { Player } = require("discord-music-player");
const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
class Music_analys extends Player {
	constructor(Bot, options) {
		super(Bot, options);
		this.guilds = new Map();
		this.intervals = new Map();
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
		this.djs = new Map();
		this.msgs_add = new Map();
	}
	init() {
		this.set_nadlers();
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
		this.client.on("interactionCreate", (interaction) => {
			if (!interaction.isButton()) return;
			const queue = this.client.player.getQueue(interaction.guild.id);
			if (queue == null || queue == undefined) {
				interaction.reply({ "content": "Этот плеер устарел используйте ``g!np``", "ephemeral": true });
				return;
			}
			const msg = this.guilds.get(queue.guild.id);
			if (msg.id != interaction.message.id) {
				interaction.reply({ "content": "Этот плеер устарел используйте ``g!np``", "ephemeral": true });
				return;
			}
			const dj = this.djs.get(interaction.guild.id);
			switch (interaction.customId) {
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
		});
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
		try {
			const ProgressBar = queue.createProgressBar();
			const options = {
				"title": song.name,
				"description": song.author,
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
			msg.edit({ "content": "Играю", "embeds": [embed], "components": [this.action_row] });
		} catch (error) {
			const options = {
				"title": song.name,
				"description": song.author,
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
	const player = new Music_analys(Bot, {
		"leaveOnEmpty": true
	});
	Bot.player = player;
	Bot.player.init();
};