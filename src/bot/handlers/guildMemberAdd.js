module.exports = {
	"once": false,
	"name": "guildMemberAdd",
	run(member) {
		if (member.client.Start) {
			member.client.Db_manager.get_server(member.guild).then((server_db) => {
				member.client.Alarms_add_remove_members.send_alarm(server_db, member);
				member.client.Manager_roles_NM_Voice.roles_add(server_db, member);
				member.client.Update_create_channel_stats.update_channels(server_db, member.guild);
				member.client.Analyzer_auto_kick.analys(server_db, member);
			});
		}
	}
};