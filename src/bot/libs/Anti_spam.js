class Anti_spam {
	constructor(Bot) {
		this.Bot = Bot;
		this.guilds = new Map();
		this.msg_to_mute = 5;
		this.time_out = 3000;
	}
	init() {
		this.set_handler();
	}
	analys(msg) {
		if (msg.constructor.name != "Message") return;
		let time_out_member = null;
		const guild = this.guilds.get(msg.guild.id);
		if (guild == undefined) {
			this.guilds.set(msg.guild.id, new Map());
			return;
		}
		const members_msg = guild.get(msg.member.id);
		if (members_msg == undefined) {
			guild.set(msg.member.id, [msg]);
			this.guilds.set(msg.guild.id, guild);
			time_out_member = setTimeout((() => {
				const _guild = this.guilds.get(msg.guild.id);
				_guild.delete(msg.member.id);
			}), this.time_out);
			return;
		}
		if (members_msg.length >= this.msg_to_mute) {
			clearTimeout(time_out_member);
			guild.delete(msg.member.id);
			this.guilds.set(msg.guild.id, guild);
			members_msg.forEach(m => {
				m.delete().catch(err => console.log(err));
			});
			msg.member.timeout(60 * 1000, "Перестаньте спамить в чат").catch((err) => console.log(`${msg.guild.toString()} ошибка мута человека`));
		} else {
			members_msg.push(msg);
		}
	}
	set_handler() {
		this.Bot.on("messageCreate", msg => {
			msg.client.Db_manager.get_server(msg.guild).then((server_db) => {
				const anti_spam_opt = server_db.get("anti_spam");
				if (anti_spam_opt == "1" || anti_spam_opt == 1) {
					this.analys(msg);
				}
			});

		});
	}
}
module.exports = (Bot) => {
	Bot.Anti_spam = new Anti_spam(Bot);
	Bot.Anti_spam.init();
};