const { MessageEmbed } = require("discord.js");
class Analyzer_auto_kick {
	constructor(Bot) {
		this.Bot = Bot;
		this.days_7 = 7 * 24 * 60 * 60 * 1000;
	}
	analys(server_db, member) {
		const auto_kick = Number(server_db.get("auto_kick"));
		if (auto_kick == 0) return;
		const date = Date.now();
		const date_user = member.user.createdTimestamp;
		const chanel_id = server_db.get("log_channel");
		let channel = null;
		if (chanel_id != null) {
			channel = member.guild.channels.cache.get(chanel_id);
		}
		if ((date - date_user) < this.days_7) {
			const embed = new MessageEmbed();
			member.kick().then(() => {
				embed.setDescription(`У ${member.toString()} аккаунт создан менее 7 дней назад, **кикаю**`);
				channel.send({ "embeds": [embed] });
			}).catch((err) => {
				embed.setDescription(`У ${member.toString()} аккаунт создан менее 7 дней назад, **Ошибка кика, проверьте права бота**`);
				channel.send({ "embeds": [embed] });
			});
		}
	}
}
module.exports = (Bot) => {
	Bot.Analyzer_auto_kick = new Analyzer_auto_kick(Bot);
};