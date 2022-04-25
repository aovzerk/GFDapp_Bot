class Base_Command {
	constructor(description) {
		this.description = description;
	}
	/*
----args----

    "Bot" - сам бот
	"inter" - interaction которое вызвало эту функцию
	"server_db" - серверв в базе данных
---
*/
	run(args) {
		console.log(`deffault log ${ this.description.name}`);
	}
	check_admin(member) {
		return member.permissions.has("ADMINISTRATOR");
	}
}
module.exports = Base_Command;