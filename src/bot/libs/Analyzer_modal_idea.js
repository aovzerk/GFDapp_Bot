const discordModals = require("../../discord-modals");
const { MessageEmbed } = require("discord.js");
const Base_lib = require("./Base_lib/Base_lib");
class Analyzer_modal_idea extends Base_lib {
	constructor(Bot) {
		super(Bot);
		this.channel_id = "968589749176635392";
		this.guild = "865553581038108702";
	}
	init() {
		this.set_handler();
	}
	set_handler() {
		const call_back_modalSubmit = (modal) => {
			if (modal.customId == "modal_idea") {
				modal.deferReply({ "ephemeral": true }).then(() => {
					modal.followUp({ "content": "``Я принял вашу идею. Передаю AOV#6953``", "ephemeral": true });
				});
				const guild = this.Bot.guilds.resolve(this.guild);
				const channel = guild.channels.resolve(this.channel_id);
				const options = {
					"title": "Новая идея!",
					"description": `${modal.getTextInputValue("ideea_text")}`,
					"fields": [
						{
							"name": "Предложил",
							"value": `\`\`${modal.member.user.username}#${modal.member.user.discriminator}\`\` - \`\`${modal.member.id}\`\``,
							"inline": false
						},
						{
							"name": "Имя сервера",
							"value": `\`\`${modal.member.guild.toString()}\`\` - \`\`${modal.member.guild.id}\`\``,
							"inline": false
						},
						{
							"name": "Статус",
							"value": "👍 - Хорошая идея\n\n👎 - плохая идея\n\n❌ - идея отклонена",
							"inline": false
						}
					]
				};
				const embed = new MessageEmbed(options);
				channel.send({ "embeds": [embed] }).then(new_msg => {
					new_msg.react("👍").then(() => {
						new_msg.react("👎");
					});
				});
			}
		};

		this.reg_callback("modalSubmit", call_back_modalSubmit);
	}
}
module.exports = (Bot) => {
	if (Bot.Analyzer_modal_idea) {
		Bot.Analyzer_modal_idea.destroy();
	}
	discordModals(Bot);
	Bot.Analyzer_modal_idea = new Analyzer_modal_idea(Bot);
	Bot.Analyzer_modal_idea.init();
};