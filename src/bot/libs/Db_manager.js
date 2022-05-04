const importFresh = require("import-fresh");
class Base_Model_manager {
	constructor(db_result) {
		this.Model_db = db_result;
	}
	get(value) {
		return this.Model_db.getDataValue(value);
	}
	set(value, data) {
		this.Model_db.setDataValue(value, data);
	}
	save() {
		return new Promise((resolve, reject) => {
			this.Model_db.save().then((new_Model) => {
				resolve(new_Model);
			}).catch(err => reject(err));
		});
	}
	delete() {
		return this.Model_db.destroy();
	}
}
class Model_settings_manager extends Base_Model_manager {
	constructor(guild, db_result) {
		super(db_result);
		this.guild = guild;
	}
}
class Model_member_settings_manager extends Base_Model_manager {
	constructor(db_result, member) {
		super(db_result);
		this.member = member;
	}
	get_partner() {
		return this.Model_db.getMember_m();
	}
	set_partner(Partner) {
		return this.Model_db.setMember_m(Partner);
	}
}
class Db_manager {
	constructor(Bot) {
		this.Bot = Bot;
		this.Server_m = importFresh("../../db/models/Server_m");
		this.Member_m = importFresh("../../db/models/Member_m");
	}
	init() {
		this.sync_tabels();
	}
	sync_tabels() {
		this.Server_m.sync({ "alter": true }).then(() => {
			console.log("Синхранизация Таблицы servers успешна");
		});
		this.Member_m.hasOne(this.Member_m, { "onDelete": "cascade" });
		this.Member_m.sync({ "alter": true }).then(() => {
			console.log("Синхранизация Таблицы members успешна");
		});
	}
	create_member(member) {
		return new Promise((resolve, reject) => {
			this.Member_m.create({ "member_id": member.id, "guild_id": member.guild.id }).then(new_member => {
				resolve(true);
			}).catch(err => reject(err));
		});
	}
	get_member(member) {
		return new Promise((resolve, reject) => {
			this.Member_m.findOne({ "where": { "member_id": member.id, "guild_id": member.guild.id } }).then(member_db => {
				if (member_db == null || member_db == undefined) {
					resolve(null);
				} else {
					resolve(new Model_member_settings_manager(member_db, member));
				}
			});
		});
	}
	delete_server(guild) {
		this.get_server(guild).then(server => {
			server.Model_db.destroy().then(() => {
				this.Member_m.destroy({
					"where": {
						"guild_id": server.guild.id
					}
				}).then(() => console.log("Гильдия удалена"));
			});
		});
	}
	get_server(guild) {
		return new Promise((resolve, reject) => {
			this.Server_m.findOne({ "where": { "server_id": guild.id } }).then((server) => {
				if (server == null) {
					this.Server_m.create({ "server_id": guild.id }).then((new_server) => {
						resolve(new Model_settings_manager(guild, new_server));
					}).catch(err => reject(err));
				} else {
					resolve(new Model_settings_manager(guild, server));
				}
			}).catch(err => reject(err));
		});
	}
	get_all_servers() {
		return new Promise((resolve, reject) => {
			this.Server_m.findAll().then(All_serers => {
				const servers = [];
				All_serers.forEach(serv => {
					const guild = this.Bot.guilds.cache.get(serv.getDataValue("server_id"));
					if (guild != undefined || guild != null) {
						servers.push(new Model_settings_manager(guild, serv));
					}
				});
				resolve(servers);
			});
		});
	}
}
module.exports = (Bot) => {
	Bot.Db_manager = new Db_manager(Bot);
	Bot.Db_manager.init();
};