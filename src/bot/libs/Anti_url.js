/* eslint-disable max-nested-callbacks */
const { MessageEmbed } = require("discord.js");
class Anti_url {
	constructor(Bot) {
		this.Bot = Bot;
		this.white_list = [
			"https://github.com/",
			"https://tenor.com/",
			"https://youtu.be/",
			"https://i.imgur.com/",
			"https://www.youtube.com/",
			"https://telegra.ph/"

		];
		this.white_channels = "https://discord.com/channels/";
	}
	init() {
		this.set_handler();
	}
	set_handler() {
		const call_back_messageCreate = (msg) => {
			this.analys(msg);
		};
		const call_back_messageUpdate = (oldMsg, newMsg) => {
			this.analys(newMsg);
		};

		this.Bot.removeListener("messageCreate", call_back_messageCreate);
		this.Bot.removeListener("messageUpdate", call_back_messageUpdate);

		this.Bot.on("messageCreate", call_back_messageCreate);
		this.Bot.on("messageUpdate", call_back_messageUpdate);
	}
	analys(msg) {
		if (msg.client.Start && msg.author.id != msg.client.user.id) {
			msg.client.Db_manager.get_server(msg.guild).then((server_db) => {
				const settings_anti_url = Number(server_db.get("anti_url"));
				if (settings_anti_url == 1) {
					const detet_urls = this.test_urls_on_string(msg.content);
					const white_urls_on_msg = [];
					this.white_list.forEach((white_url) => {
						detet_urls.forEach(url => {
							if (url.includes(white_url)) {
								white_urls_on_msg.push(url);
							}
						});
					});
					if (white_urls_on_msg.length != detet_urls.length) {
						msg.guild.invites.fetch().then(invites => {
							const white_invites = [];
							invites.forEach((invite) => {
								detet_urls.forEach((url) => {
									if (invite.toString() == url) {
										white_invites.push(invite.toString());
									}
								});
							});
							const white_channels = [];
							detet_urls.forEach(url => {
								if (url.includes(`${this.white_channels}${msg.guild.id}`)) {
									white_channels.push(url);
								}
							});
							if (white_invites.length + white_urls_on_msg.length + white_channels.length != detet_urls.length) {
								msg.delete();
								const embed = new MessageEmbed()
									.setTitle("Обнаружена ссылка")
									.setDescription(`${msg.member.toString()}, ипользуйте **/url** для публикации ссылок`);
								msg.channel.send({ "embeds": [embed] }).then(new_msg => {
									setTimeout(() => new_msg.delete(), 5000);
								});
							}
						});
					}
				}

			});
		}
	}
	test_urls_on_string(str) {
		const trim_str = str.trim();
		const array_str = trim_str.split(" ").filter(entery => entery.trim() != "");
		const detect_url = [];
		array_str.forEach((_str) => {
			if (this.test_str(_str) != null) {
				detect_url.push(_str);
			}
		});
		return detect_url;

	}
	test_str(str) {
		if (str == null) return false;
		if (str == "") return false;
		return str.match(/((http|https):\/\/(www\.)?[a-zа-я0-9-]+\.[a-zа-я0-9-]{2,6})/i);
	}
}
module.exports = (Bot) => {
	Bot.Anti_url = new Anti_url(Bot);
	Bot.Anti_url.init();
};