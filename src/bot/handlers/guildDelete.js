module.exports = {
	"once": false,
	"name": "guildDelete",
	run(guild) {
		guild.client.Db_manager.get_server(guild).then((server_db) => {
			server_db.delete();
		});
	}
};