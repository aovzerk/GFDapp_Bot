module.exports = {
	"once": false,
	"name": "voiceStateUpdate",
	run(oldState, newState) {
		if (oldState.guild.client.Start) {
			oldState.guild.client.Db_manager.get_server(oldState.guild).then((server_db) => {
				if (oldState.channel && !newState.channel) {
					oldState.guild.client.Manager_roles_NM_Voice.roles_delete_voice(server_db, oldState.member);
				} else if (!oldState.channel && newState.channel) {
					oldState.guild.client.Manager_roles_NM_Voice.roles_add_voice(server_db, oldState.member);
				}
			});
		}

	}
};