/* eslint-disable max-nested-callbacks */
const Base_lib = require("./Base_lib/Base_lib");
class Private_channel_system extends Base_lib {
	constructor(Bot) {
		super(Bot);
		this.guilds = new Map();
		this.interval = null;
	}
	init() {
		this.set_handler();
	}
	delete_channls_for_work(guild, server_db) {
		const channel_caregory_privat_id = server_db.get("channel_caregory_privat");
		const channel_privat_id = server_db.get("channel_privat");
		if (channel_caregory_privat_id == null || channel_privat_id == null) return;

		const channel_category = guild.channels.cache.get(channel_caregory_privat_id);
		const channel_private = guild.channels.cache.get(channel_privat_id);
		server_db.set("channel_caregory_privat", null);
		server_db.set("channel_privat", null);
		return new Promise((resolve, reject) => {
			server_db.save().then(() => {
				Promise.all([
					channel_category.delete(),
					channel_private.delete()
				]).then(() => resolve(true));
			});
		});
	}
	create_channls_for_work(guild, server_db) {
		return new Promise((resolve, reject) => {
			Promise.all([
				this.create_channel_work("GUILD_CATEGORY", "Приватки", guild),
				this.create_channel_work("GUILD_VOICE", "Создать приватку", guild)
			]).then((channels) => {
				channels[1].setParent(channels[0].id).then(() => null);
				server_db.set("channel_caregory_privat", channels[0].id);
				server_db.set("channel_privat", channels[1].id);
				server_db.save().then(resolve(true));
			});
		});
	}
	create_channel_work(type, name, guild) {
		return guild.channels.create(name, {
			"type": type,
			"permissionOverwrites": [
				{
					"id": guild.roles.everyone,
					"allow": ["VIEW_CHANNEL", "SEND_MESSAGES", "READ_MESSAGE_HISTORY", "CONNECT", "SPEAK"]
				}
			]
		});
	}
	create_channel(member) {
		return new Promise((resolve, reject) => {
			member.guild.channels.create(`Комната ${member.user.username}`, { "type": "GUILD_VOICE" }).then(channel => {
				channel.permissionOverwrites.edit(member, {
					"MANAGE_CHANNELS": true,
					"MUTE_MEMBERS": true,
					"MODERATE_MEMBERS": true
				}).then(new_channel => {
					resolve(new_channel);
				});
			});
		});

	}
	set_handler() {
		const call_back_ready = (client) => {
			client.Db_manager.get_all_servers().then(servers => {
				servers.forEach(server_db => {
					const channel_caregory_privat_id = server_db.get("channel_caregory_privat");
					const channel_privat_id = server_db.get("channel_privat");
					if (channel_caregory_privat_id != null || channel_privat_id != null) {
						server_db.guild.channels.fetch(channel_caregory_privat_id).then(category => {
							category.children.forEach(channel_ => {
								if (channel_.id != channel_privat_id && channel_.members.size == 0) {
									channel_.delete();
								}
							});
						}).catch(err => {
							server_db.set("channel_privat", null);
							server_db.set("channel_caregory_privat", null);
							server_db.save().then(() => null);
						});
					}
				});
			});
		};
		const call_back_voiceStateUpdate = (oldState, newState) => {
			oldState.guild.client.Db_manager.get_server(oldState.guild).then((server_db) => {
				const channel_category_id = server_db.get("channel_caregory_privat");
				const channel_privat_id = server_db.get("channel_privat");
				if (channel_category_id == null || channel_privat_id == null) return;
				if ((!oldState.channel && newState.channel && newState.channel.id == channel_privat_id) || (oldState.channel && oldState.channel.parentId != channel_category_id && newState.channel && newState.channel.id == channel_privat_id)) {
					const guild = this.guilds.get(oldState.guild.id);
					if (guild == undefined || guild == null) {
						this.guilds.set(oldState.guild.id, new Map());
						this.create_channel(oldState.member).then(new_channel => {
							new_channel.setParent(channel_category_id);
							oldState.member.voice.setChannel(new_channel.id);
							const _guild = this.guilds.get(oldState.guild.id);
							_guild.set(oldState.member.id, new_channel);
							this.guilds.set(oldState.guild.id, _guild);
						});
						return;
					} else {
						this.create_channel(oldState.member).then(new_channel => {
							new_channel.setParent(channel_category_id);
							oldState.member.voice.setChannel(new_channel.id);
							const _guild = this.guilds.get(oldState.guild.id);
							_guild.set(oldState.member.id, new_channel);
							this.guilds.set(oldState.guild.id, _guild);
						});
						return;
					}
				}
				if (newState.channel && newState.channel.id == channel_privat_id) {
					const guild = this.guilds.get(oldState.guild.id);
					if (guild == undefined || guild == null) {
						this.guilds.set(oldState.guild.id, new Map());
						this.create_channel(oldState.member).then(new_channel => {
							new_channel.setParent(channel_category_id);
							oldState.member.voice.setChannel(new_channel.id);
							const _guild = this.guilds.get(oldState.guild.id);
							_guild.set(oldState.member.id, new_channel);
							this.guilds.set(oldState.guild.id, _guild);
						});
						return;
					} else {
						const member_chn = guild.get(oldState.member.id);
						if (member_chn == undefined || member_chn == null) {
							this.create_channel(oldState.member).then(new_channel => {
								new_channel.setParent(channel_category_id);
								oldState.member.voice.setChannel(new_channel.id);
								const _guild = this.guilds.get(oldState.guild.id);
								_guild.set(oldState.member.id, new_channel);
								this.guilds.set(oldState.guild.id, _guild);
							});
							return;
						} else {
							oldState.member.voice.setChannel(member_chn.id);
							return;
						}

					}
				}
				const guild = this.guilds.get(oldState.guild.id);
				if (guild == undefined || guild == null) return;
				const member_chn = guild.get(oldState.member.id);
				if (member_chn == undefined || member_chn == null) return;
				if (oldState.channel && oldState.channel.id == member_chn.id && newState.channel) {
					oldState.member.voice.setChannel(member_chn.id);
					return;
				}
				if (oldState.channel && oldState.channel.id && !newState.channel) {
					member_chn.delete().then(() => {
						guild.delete(oldState.member.id);
						this.guilds.set(oldState.guild.id, guild);
					});
				}
			});
		};

		this.reg_callback("ready", call_back_ready, true);
		this.reg_callback("voiceStateUpdate", call_back_voiceStateUpdate);
		this.interval = setInterval(() => call_back_ready(this.Bot), 10 ^ 60 * 1000);
	}
}
module.exports = (Bot) => {
	if (Bot.Private_channel_system) {
		Bot.Private_channel_system.destroy();
	}
	Bot.Private_channel_system = new Private_channel_system(Bot);
	Bot.Private_channel_system.init();
};