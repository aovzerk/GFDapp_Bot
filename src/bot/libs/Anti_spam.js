const Base_lib = require("./Base_lib/Base_lib");
class Anti_spam extends Base_lib {
	constructor(Bot) {
		super(Bot);
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
		if (msg && msg.member && msg.member.id) {
			const members_msg = guild.get(msg.member.id);
			if (members_msg == undefined) {
				guild.set(msg.member.id, [msg]);
				time_out_member = setTimeout((() => {
					const _guild = this.guilds.get(msg.guild.id);
					_guild.delete(msg.member.id);
				}), this.time_out);
				return;
			}
			if (members_msg.length >= this.msg_to_mute) {
				msg.member.timeout(60 * 1000, "Перестаньте спамить в чат").catch((err) => console.log(`${msg.guild.toString()} ошибка мута человека`));
				clearTimeout(time_out_member);
				guild.delete(msg.member.id);
				members_msg.forEach(m => {
					m.delete().catch(err => console.log(err));
				});
			} else {
				members_msg.push(msg);
			}
		}

	}
	set_handler() {
		const call_back_messageCreate = (msg) => {
			msg.client.Db_manager.get_server(msg.guild).then((server_db) => {
				const anti_spam_opt = Number(server_db.get("anti_spam"));
				if (anti_spam_opt == 1) {
					this.analys(msg);
				}
			});

		};

		this.reg_callback("messageCreate", call_back_messageCreate);
	}
}
module.exports = (Bot) => {
	if (Bot.Anti_spam) {
		Bot.Anti_spam.destroy();
	}
	Bot.Anti_spam = new Anti_spam(Bot);
	Bot.Anti_spam.init();
};