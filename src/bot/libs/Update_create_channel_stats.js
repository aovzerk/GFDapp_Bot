/* eslint-disable max-nested-callbacks */
class Update_create_channel_stats {
	constructor(Bot) {
		this.Bot = Bot;
		this.pos = 0;
	}
	delete_channels(server_db, guild) {
		return new Promise((resolve, reject) => {
			const id_all = server_db.get("channel_stats_all");
			const id_users = server_db.get("channel_stats_users");
			const id_bots = server_db.get("channel_stats_bots");
			const id_category = server_db.get("channel_stats_category");
			if (id_all == null || id_users == null || id_bots == null) return;
			const channel_all = guild.channels.cache.get(id_all);
			const channel_users = guild.channels.cache.get(id_users);
			const channel_bots = guild.channels.cache.get(id_bots);
			const channel_category = guild.channels.cache.get(id_category);
			channel_all.delete().then(() => {
				channel_users.delete().then(() => {
					channel_bots.delete().then(() => {
						channel_category.delete().then(() => {
							server_db.set("channel_stats_category", null);
							server_db.set("channel_stats_all", null);
							server_db.set("channel_stats_users", null);
							server_db.set("channel_stats_bots", null);
							server_db.save().then(() => resolve(true));
						});
					});
				});
			});
		});
	}
	create_channels(server_db, guild) {
		return new Promise((resolve, reject) => {
			this.get_bots(guild).then(bots => {
				const members = guild.memberCount - bots;
				const all = guild.memberCount;
				this.create_channel("Статистика сервера", "GUILD_CATEGORY", guild).then(channel_category => {
					channel_category.setPosition(0);
					this.create_channel(`👥Всего: ${all}`, "GUILD_VOICE", guild).then(channel_all => {
						channel_all.setParent(channel_category.id);
						this.create_channel(`👤Люди: ${members}`, "GUILD_VOICE", guild).then(channel_members => {
							channel_members.setParent(channel_category.id);
							this.create_channel(`🤖Боты: ${bots}`, "GUILD_VOICE", guild).then(channel_bots => {
								channel_bots.setParent(channel_category.id);
								server_db.set("channel_stats_category", channel_category.id);
								server_db.set("channel_stats_all", channel_all.id);
								server_db.set("channel_stats_users", channel_members.id);
								server_db.set("channel_stats_bots", channel_bots.id);
								server_db.save().then(() => resolve(true));
							});
						});
					});
				});
			});
		});
	}
	update_channels(server_db, guild) {
		return new Promise((resolve, reject) => {
			this.get_bots(guild).then(bots => {
				const members = guild.memberCount - bots;
				const all = guild.memberCount;
				const id_all = server_db.get("channel_stats_all");
				const id_users = server_db.get("channel_stats_users");
				const id_bots = server_db.get("channel_stats_bots");
				if (id_all == null || id_users == null || id_bots == null) return;
				const channel_all = guild.channels.cache.get(id_all);
				const channel_users = guild.channels.cache.get(id_users);
				const channel_bots = guild.channels.cache.get(id_bots);
				channel_all.setName(`👥Всего: ${all}`).then(() => {
					channel_users.setName(`👤Люди: ${members}`).then(() => {
						channel_bots.setName(`🤖Боты: ${bots}`).then(() => {
							resolve(true);
						});
					});
				});
			});
		});
	}
	create_channel(name, type, guild) {
		return guild.channels.create(name, {
			"type": type,
			"permissionOverwrites": [
				{
					"id": guild.roles.everyone,
					"allow": ["VIEW_CHANNEL"],
					"deny": ["SEND_MESSAGES", "READ_MESSAGE_HISTORY", "CONNECT"]
				}
			]
		});
	}
	get_bots(guild) {
		return new Promise((resolve, reject) => {
			this.get_members(guild).then(members => {
				resolve(guild.memberCount - members);
			}).catch(err => reject(err));
		});
	}
	get_members(guild) {
		return new Promise((resolve, reject) => {
			guild.members.fetch().then(members => {
				resolve(members.filter(member => !member.user.bot).size);
			}).catch(err => reject(err));
		});
	}
}
module.exports = (Bot) => {
	Bot.Update_create_channel_stats = new Update_create_channel_stats(Bot);
};