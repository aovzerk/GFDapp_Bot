const { MessageEmbed } = require("discord.js");
class Analyzer_select_menu_roles {
	constructor(Bot) {
		this.Bot = Bot;
	}
	init() {
		this.set_handler();
	}
	set_handler() {
		const callback_interactionCreate = (interaction) => {
			if (!interaction.isSelectMenu() || interaction.customId != "menu_role") return;
			const embed = new MessageEmbed();
			interaction.deferReply({ "ephemeral": true });
			const selected = new Set(interaction.values);
			const all = this.get_all_values(interaction);
			const remove_roles = all.filter(el => !selected.has(el));
			const roles_add = Array.from(selected);
			let description_adds = "";
			let description_removes = "";
			remove_roles.forEach(role_id => {
				description_removes = `${description_removes }<@&${ role_id }>` + ", ";
			});
			roles_add.forEach(role_id => {
				description_adds = `${description_adds }<@&${ role_id }>` + ", ";
			});
			embed.setDescription(`Добавлены роли: ${description_adds}\n\nУдалены: ${description_removes}`);
			interaction.member.roles.add(roles_add).then(() => {
				interaction.member.roles.remove(remove_roles).then(() => {
					interaction.editReply({ "embeds": [embed], "ephemeral": true });
				});
			});

		};

		this.Bot.removeListener("interactionCreate", callback_interactionCreate);

		this.Bot.on("interactionCreate", callback_interactionCreate);
	}
	get_all_values(interaction) {
		const roles = [];
		interaction.component.options.forEach(option => {
			roles.push(option.value);
		});
		return roles;
	}
}
module.exports = (Bot) => {
	Bot.Analyzer_select_menu_roles = new Analyzer_select_menu_roles(Bot);
	Bot.Analyzer_select_menu_roles.init();
};