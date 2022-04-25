module.exports = {
	"once": false,
	"name": "messageCreate",
	run(msg) {
		if (msg.client.Start && msg.author.id != msg.client.user.id) {
			msg.client.Db_manager.get_server(msg.guild).then((server_db) => {
				const parser = msg.client.Command_Parser.get_parser(msg);
				parser.parse(server_db);
			});
		}
	}
};