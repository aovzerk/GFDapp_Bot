/* eslint-disable max-nested-callbacks */
const { MessageEmbed } = require("discord.js");
class Alarms_bump {
	constructor(Bot) {
		this.Bot = Bot;
		this.white_list = new Map();
		this.white_list = new Map();
		this.white_list.set("575776004233232386", ["Вы успешно лайкнули сервер.", "/like"]); // DSMonitoring
		this.white_list.set("464272403766444044", ["Время фиксации апа:", "/up"]); // SD.C Monitoring
		this.white_list.set("315926021457051650", ["Server bumped by", "!bump"]); // Server Monitoring
		this.white_list.set("302050872383242240", ["Bump done!", "/bump"]); // DISBOARD
		this.hours_4 = 14400000;
	}
	init() {
		this.set_handler();
	}
	set_handler() {
		this.Bot.once("ready", () => {
			this.first_start();
		});
		this.Bot.on("messageCreate", msg => {
			this.analys(msg);
		});
	}
	first_start() {
		this.Bot.Db_manager.get_all_servers().then(servers_db => {
			servers_db.forEach(server_db => {
				const settings_bump = Number(server_db.get("bump"));
				if (settings_bump == 1) {
					const roles_ping = server_db.get("roles_bump");
					let content = "";
					if (roles_ping != null) {
						const array_roles = roles_ping.split(",");
						array_roles.forEach(role => {
							content = `${content }<@&${role}> `;
						});
					} else {
						content = null;
					}
					const channel_bump = server_db.guild.channels.cache.get(server_db.get("channel_bump"));
					if (channel_bump) {
						server_db.guild.members.fetch().then(members => {
							const date = Date.now();
							this.white_list.forEach((value, key) => {
								const bot = members.get(key);
								if (bot != undefined || bot != null) {
									switch (value[1]) {
										case "/like":
											setTimeout(() => this.sendEmbed({ "msg": { "channel": channel_bump }, "content": content, "description": "``/like``", "title": "Время бамбать!" }), Number(server_db.get("bump_like")) - date);
											break;
										case "/up":
											setTimeout(() => this.sendEmbed({ "msg": { "channel": channel_bump }, "content": content, "description": "``/up``", "title": "Время бамбать!" }), Number(server_db.get("bump_up")) - date);
											break;
										case "!bump":
											setTimeout(() => this.sendEmbed({ "msg": { "channel": channel_bump }, "content": content, "description": "``!bump``", "title": "Время бамбать!" }), Number(server_db.get("bump_bump")) - date);
											break;
										case "/bump":
											setTimeout(() => this.sendEmbed({ "msg": { "channel": channel_bump }, "content": content, "description": "``/bump`` <@302050872383242240>", "title": "Время бамбать!" }), Number(server_db.get("bump_dbump")) - date);
											break;
										default:
											break;
									}
								}
							});
						});

					}
				}
			});
		});
	}
	analys(msg) {
		if (msg.embeds.length == 0 || msg.embeds[0].description == null) return;
		const white_bot = this.white_list.get(msg.author.id);
		if (white_bot == undefined || white_bot == null) return;
		const bump = String(msg.embeds[0].description).includes(white_bot[0]);
		if (bump) {
			msg.client.Db_manager.get_server(msg.guild).then((server_db) => {
				const settings_bump = Number(server_db.get("bump"));
				if (settings_bump == 0) return;
				const channel_send_alarm = server_db.get("channel_bump");
				if (channel_send_alarm != msg.channel.id) {
					server_db.set("channel_bump", msg.channel.id);
				}
				const roles_ping = server_db.get("roles_bump");
				let content = "";
				if (roles_ping != null) {
					const array_roles = roles_ping.split(",");
					array_roles.forEach(role => {
						content = `${content }<@&${role}> `;
					});
				} else {
					content = null;
				}
				const date = Date.now() + this.hours_4;
				const date_2h = date - (this.hours_4 / 2);

				switch (white_bot[1]) {
					case "/like":
						server_db.set("bump_like", date);
						setTimeout(() => this.sendEmbed({ "msg": msg, "content": content, "description": "``/like``", "title": "Время бамбать!" }), this.hours_4);
						break;
					case "/up":
						server_db.set("bump_up", date);
						setTimeout(() => this.sendEmbed({ "msg": msg, "content": content, "description": "``/up``", "title": "Время бамбать!" }), this.hours_4);
						break;
					case "!bump":
						server_db.set("bump_bump", date);
						setTimeout(() => this.sendEmbed({ "msg": msg, "content": content, "description": "``!bump``", "title": "Время бамбать!" }), this.hours_4);
						break;
					case "/bump":
						server_db.set("bump_dbump", date_2h);
						setTimeout(() => this.sendEmbed({ "msg": msg, "content": content, "description": "``/bump`` <@302050872383242240>", "title": "Время бамбать!" }), this.hours_4 / 2);
						break;
					default:
						break;
				}
				server_db.save();
			});
		}
	}
	sendEmbed(cfg) {
		const embed = new MessageEmbed();
		embed.setTitle(cfg.title);
		embed.setDescription(cfg.description);
		if (cfg.content) {
			cfg.msg.channel.send({ "content": cfg.content, "embeds": [embed] });
		} else {
			cfg.msg.channel.send({ "embeds": [embed] });
		}

	}
}
module.exports = (Bot) => {
	Bot.Alarms_bump = new Alarms_bump(Bot);
	Bot.Alarms_bump.init();
};