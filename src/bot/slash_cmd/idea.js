const Base_Command = require("./Class_Command/Base_Command");
const name_command = "idea";
const description_command = global.config_slash[name_command];
const { Modal, TextInputComponent, showModal } = require("discord-modals");
/*
----args----

    "Bot" - сам бот
	"inter" - interaction которое вызвало эту функцию
	"server_db" - серверв в базе данных
---
*/

class Command extends Base_Command {
	constructor(description) {
		super(description);// GIVE_PERM
	}
	run(args) {
		const modal = new Modal() // We create a Modal
			.setCustomId("modal_idea")
			.setTitle("Новая идея!")
			.addComponents(
				new TextInputComponent()
					.setCustomId("ideea_text")
					.setLabel("Идея для бота")
					.setStyle("LONG")
					.setMinLength(10)
					.setMaxLength(255)
					.setPlaceholder("Ваша идея")
					.setRequired(true)
			);
		showModal(modal, {
			"client": args.Bot,
			"interaction": args.inter
		});

	}
}
module.exports = new Command(description_command);