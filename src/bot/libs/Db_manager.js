class Model_settings_manager {
	constructor(guild, db_result) {
		this.guild = guild;
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
class Db_manager {
	constructor(Bot) {
		this.Bot = Bot;
		this.Server_m = require("../../db/models/Server_m");
	}
	init() {
		this.sync_tabels();
	}
	sync_tabels() {
		this.Server_m.sync({ "alter": true }).then(() => {
			console.log("Синхранизация Таблицы servers успешна");
		});
	}
	delete_server(guild) {
		this.get_server(guild).then(server => {
			server.Model_db.destroy();
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