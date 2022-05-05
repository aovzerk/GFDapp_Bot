const translate = require("translate-google");
const Base_lib = require("./Base_lib/Base_lib");
class Analyzer_message_commands extends Base_lib {
	constructor(Bot) {
		super(Bot);
	}
	init() {
		this.set_handlet();
	}
	set_handlet() {
		const callback_interactionCreate = (interaction) => {
			if (!interaction.isMessageContextMenu()) return;
			switch (interaction.commandName) {
				case "Перевести на RUS":
					this.translate(interaction, "ru");
					break;
				case "Перевести на ENG":
					this.translate(interaction, "en");
					break;
				default:
					break;
			}
		};

		this.reg_callback("interactionCreate", callback_interactionCreate);
	}
	translate(interaction, lang) {
		const msg = interaction.targetMessage;
		interaction.deferReply({ "ephemeral": true }).then(() => {
			translate(msg.content, { "to": lang }).then(result => {
				interaction.editReply({ "content": result, "ephemeral": true });
			});
		});
	}
}
module.exports = (Bot) => {
	if (Bot.Analyzer_message_commands) {
		Bot.Analyzer_message_commands.destroy();
	}
	Bot.Analyzer_message_commands = new Analyzer_message_commands(Bot);
	Bot.Analyzer_message_commands.init();
};