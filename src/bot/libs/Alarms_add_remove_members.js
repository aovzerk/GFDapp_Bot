const { MessageEmbed } = require("discord.js");
const giphy = require("giphy-api")(global.main_config.token_giphy);
class Alarms_add_remove_members {
	constructor(Bot) {
		this.Bot = Bot;
	}
	send_alarm(server_db, member) {
		const channel = server_db.get("channel_new_member");
		if (channel == null) return;
		const channel_guild = member.guild.channels.cache.get(channel);
		this.get_gif_image("welcome").then((gif_url) => {
			const embed = new MessageEmbed();
			embed.setDescription(`${member.toString()} **Добро пожаловать на сервер** [ ${member.guild.toString()} ]`);
			embed.setTitle("Новый пользователь!");
			embed.setImage(gif_url);
			channel_guild.send({ "embeds": [embed] });
		});
	}
	send_alarm_exit(server_db, member) {
		const channel = server_db.get("channel_new_member");
		if (channel == null) return;
		const channel_guild = member.guild.channels.cache.get(channel);
		this.get_gif_image("bye").then((gif_url) => {
			const embed = new MessageEmbed();
			embed.setDescription(`${member.toString()} **Вышел с сервера** [ ${member.guild.toString()} ]`);
			embed.setTitle("Выход с сервера!");
			embed.setImage(gif_url);
			channel_guild.send({ "embeds": [embed] });
		});
	}
	get_gif_image(request_string) {
		return new Promise((resolve, reject) => {
			giphy.search(request_string).then(result => {
				resolve(result.data[this.getRandomInt(result.data.length)].images.original.url);
			}).catch(err => reject(err));
		});
	}
	getRandomInt(max) {
		return Math.floor(Math.random() * max);
	}
}
module.exports = (Bot) => {
	Bot.Alarms_add_remove_members = new Alarms_add_remove_members(Bot);
};