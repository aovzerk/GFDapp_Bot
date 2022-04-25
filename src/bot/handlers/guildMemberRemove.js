module.exports = {
	"once": false,
	"name": "guildMemberRemove",
	run(member) {
		if (member.client.Start) {
			member.client.Db_manager.get_server(member.guild).then((server_db) => {
				member.client.Alarms_add_remove_members.send_alarm_exit(server_db, member);
				member.client.Update_create_channel_stats.update_channels(server_db, member.guild);
			});
		}
	}
};