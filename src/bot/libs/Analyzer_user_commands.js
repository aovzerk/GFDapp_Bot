
const { MessageEmbed } = require("discord.js");
class Analyzer_user_commands {
	constructor(Bot) {
		this.Bot = Bot;
		this.ulrs_hug = ["https://cdn.discordapp.com/attachments/942273549148770396/942275139637219358/hug_13.gif", "https://cdn.discordapp.com/attachments/942273549148770396/942275139981180948/hug_11.gif", "https://cdn.discordapp.com/attachments/942273549148770396/942275140308324352/hug_12.gif", "https://cdn.discordapp.com/attachments/942273549148770396/942275093285961758/hug_10.gif", "https://cdn.discordapp.com/attachments/942273549148770396/942275093571178506/hug_1.gif", "https://cdn.discordapp.com/attachments/942273549148770396/942275093915136000/hug_2.gif", "https://cdn.discordapp.com/attachments/942273549148770396/942275094170992670/hug_3.gif", "https://cdn.discordapp.com/attachments/942273549148770396/942275094477160468/hug_4.gif", "https://cdn.discordapp.com/attachments/942273549148770396/942275095005626388/hug_5.gif", "https://cdn.discordapp.com/attachments/942273549148770396/942275095525724210/hug_6.gif", "https://cdn.discordapp.com/attachments/942273549148770396/942275095869673532/hug_7.gif", "https://cdn.discordapp.com/attachments/942273549148770396/942275096272314429/hug_8.gif", "https://cdn.discordapp.com/attachments/942273549148770396/942275097115373618/hug_9.gif"];
		this.urls_pat = ["https://cdn.discordapp.com/attachments/942273549148770396/942275924399894568/pat_8.gif", "https://cdn.discordapp.com/attachments/942273549148770396/942275924697702400/pat_1.gif", "https://cdn.discordapp.com/attachments/942273549148770396/942275925284900884/pat_2.gif", "https://cdn.discordapp.com/attachments/942273549148770396/942275925532377098/pat_3.gif", "https://cdn.discordapp.com/attachments/942273549148770396/942275925897256960/pat_4.gif", "https://cdn.discordapp.com/attachments/942273549148770396/942275926287323146/pat_5.gif", "https://cdn.discordapp.com/attachments/942273549148770396/942275926547386388/pat_6.gif", "https://cdn.discordapp.com/attachments/942273549148770396/942275926937452606/pat_7.gif"];
	}
	init() {
		this.set_handler();
	}
	set_handler() {
		this.Bot.on("interactionCreate", (interacion) => {
			if (!interacion.isUserContextMenu()) return;
			switch (interacion.commandName) {
				case "Обнять":
					this.send_hug(interacion);
					break;
				case "Погладить":
					this.send_pat(interacion);
					break;
				case "Аватарка":
					this.send_ava(interacion);
					break;
				case "Баннер":
					this.send_banner(interacion);
					break;
				default:
					break;
			}
		});
	}
	send_banner(interacion) {
		interacion.guild.members.fetch(interacion.targetId).then(user => {
			user.user.fetch().then(fetched_user => {
				const banner = fetched_user.bannerURL({ "size": 4096, "dynamic": true }, true);
				if (banner == null) return interacion.reply({ "content": "У юзера нет баннера", "ephemeral": true });
				const options = {
					"description": `**Баннер ${user.toString()}**`,
					"image": {
						"url": `${fetched_user.bannerURL({ "size": 4096, "dynamic": true }, true)}`
					},
					"fields": [
						{
							"name": "форматы аватарки",
							"value": `[jpeg](${fetched_user.bannerURL({ "size": 4096, "format": "jpeg" })})`,
							"inline": true
						}
					]
				};
				const embed = new MessageEmbed(options);
				interacion.reply({ "embeds": [embed] });
			});
		}).catch(err => {
			console.log(err);
			interacion.reply({ "content": "Юзер не найден", "ephemeral": true });
			return;
		});
	}
	send_ava(interacion) {
		interacion.guild.members.fetch(interacion.targetId).then(user => {
			const ava = user.user.avatarURL({ "size": 4096, "dynamic": true }, true);
			if (ava == null) return interacion.reply({ "content": "У юзера нет аватарки", "ephemeral": true });
			const options = {
				"description": `**Аватарка ${user.toString()}**`,
				"image": {
					"url": `${user.user.avatarURL({ "size": 4096, "dynamic": true }, true)}`
				},
				"fields": [
					{
						"name": "форматы аватарки",
						"value": `[jpeg](${user.user.avatarURL({ "size": 4096, "format": "jpeg" })})`,
						"inline": true
					}
				]
			};
			const embed = new MessageEmbed(options);
			interacion.reply({ "embeds": [embed] });
		}).catch(err => {
			console.log(err);
			interacion.reply({ "content": "Юзер не найден", "ephemeral": true });
			return;
		});
	}
	send_hug(interacion) {
		const url = this.ulrs_hug[this.getRandomInt(this.ulrs_hug.length)];
		const embed = new MessageEmbed()
			.setDescription(`${interacion.member.toString()} обнимает <@${interacion.targetId}>`)
			.setTitle("Обнимашки :3")
			.setImage(url);
		interacion.reply({ "content": `<@!${interacion.targetId}>`, "embeds": [embed] });
	}
	send_pat(interacion) {
		const url = this.urls_pat[this.getRandomInt(this.urls_pat.length)];
		const embed = new MessageEmbed()
			.setDescription(`${interacion.member.toString()} гладит <@${interacion.targetId}>`)
			.setTitle("<3 :3")
			.setImage(url);
		interacion.reply({ "content": `<@!${interacion.targetId}>`, "embeds": [embed] });
	}
	getRandomInt(max) {
		return Math.floor(Math.random() * max);
	}
}
module.exports = (Bot) => {
	Bot.Analyzer_user_commands = new Analyzer_user_commands(Bot);
	Bot.Analyzer_user_commands.init();
};