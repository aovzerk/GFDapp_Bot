const translate = require("translate-google");
class Analyzer_message_commands {
	constructor(Bot) {
		this.Bot = Bot;
	}
	init() {
		this.set_handlet();
	}
	set_handlet() {
		this.Bot.on("interactionCreate", interaction => {
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
		});
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
	Bot.Analyzer_message_commands = new Analyzer_message_commands(Bot);
	Bot.Analyzer_message_commands.init();
};