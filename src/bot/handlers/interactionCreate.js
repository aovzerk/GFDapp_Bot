module.exports = {
	"once": false,
	"name": "interactionCreate",
	run(interaction) {
		if (interaction.client.Start) {
			interaction.client.Db_manager.get_server(interaction.guild).then((server_db) => {
				const parser = interaction.client.Command_Parser.get_parser(interaction);
				if (parser == null) return;
				parser.parse(server_db);
			});
		}
	}
};