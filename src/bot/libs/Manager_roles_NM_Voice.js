class Manager_roles_NM_Voice {
	constructor(Bot) {
		this.Bot = Bot;
	}
	roles_add(server_db, member) {
		this.add(server_db, member, "roles_add_nm");
	}
	roles_add_voice(server_db, member) {
		this.add(server_db, member, "roles_add_voice");
	}
	roles_delete_voice(server_db, member) {
		this.remove(server_db, member, "roles_add_voice");
	}
	get_roles(server_db, type) {
		const _roles_str = server_db.get(type);
		if (_roles_str == null) return null;
		const roles = _roles_str.split(",");
		return roles;
	}
	add(server_db, member, type) {
		const roles = this.get_roles(server_db, type);
		if (roles != null) member.roles.add(roles).catch(err => console.log(err));

	}
	remove(server_db, member, type) {
		const roles = this.get_roles(server_db, type);
		if (roles != null) member.roles.remove(roles).catch(err => console.log(err));
	}
}
module.exports = (Bot) => {
	Bot.Manager_roles_NM_Voice = new Manager_roles_NM_Voice(Bot);
};