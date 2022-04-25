module.exports = {
	"once": false,
	"name": "guildCreate",
	run(guild) {
		guild.client.Db_manager.get_server(guild).then((server_db) => {
			//
		});
	}
};