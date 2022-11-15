const { MessageEmbed } = require("discord.js");
const Base_lib = require("./Base_lib/Base_lib");
class Log_guild_settings {
	constructor(log) {
		this.log = log;
	}
	get_embed() {
		const embed = new MessageEmbed()
			.setDescription(this.toString());
		return embed;
	}
	toString() {
		let strings_change = `**${this.log.action}**\n`;
		if (this.log.extra) {
			strings_change = `${strings_change} **Объект изменений: - **${this.log.extra.toString()}\n`;
		}
		this.log.changes.forEach(log_el => {
			switch (log_el.key) {
				case "$remove":
					strings_change = `${strings_change}**${log_el.key}:**\n\`\`Было\`\` - ${log_el.new == undefined ? " " : this.get_string_roles(log_el.new) } \n\`\`Стало\`\` - ${log_el.old == undefined ? " " : this.get_string_roles(log_el.old)}\n\`\`Внес изменения\`\` - \`\`${this.log.executor.username}#${this.log.executor.discriminator} - ${this.log.executor.id}\`\`\n\n`;
					break;
				case "$add":
					strings_change = `${strings_change}**${log_el.key}:**\n\`\`Было\`\` - ${log_el.old == undefined ? " " : this.get_string_roles(log_el.old) } \n\`\`Стало\`\` - ${log_el.new == undefined ? " " : this.get_string_roles(log_el.new)}\n\`\`Внес изменения\`\` - \`\`${this.log.executor.username}#${this.log.executor.discriminator} - ${this.log.executor.id}\`\`\n\n`;
					break;
				case "deny":
					strings_change = `${strings_change}**${log_el.key}:**\n\`\`Было\`\` - ${log_el.old == undefined ? " " : `[Старые права](https://discordapi.com/permissions.html#${log_el.old})` } \n\`\`Стало\`\` - ${log_el.new == undefined ? " " : `[Новые права](https://discordapi.com/permissions.html#${log_el.new})`}\n\`\`Внес изменения\`\` - \`\`${this.log.executor.username}#${this.log.executor.discriminator} - ${this.log.executor.id}\`\`\n\n`;
					break;
				case "permission_overwrites":
					strings_change = `${strings_change}**${log_el.key}:**\n\`\`Было\`\` - ${log_el.old == undefined ? " " : this.get_string_roles(log_el.old) } \n\`\`Стало\`\` - ${log_el.new == undefined ? " " : this.get_string_roles(log_el.new)}\n\`\`Внес изменения\`\` - \`\`${this.log.executor.username}#${this.log.executor.discriminator} - ${this.log.executor.id}\`\`\n\n`;
					break;
				case "allow":
					strings_change = `${strings_change}**${log_el.key}:**\n\`\`Было\`\` - ${log_el.old == undefined ? " " : `[Старые права](https://discordapi.com/permissions.html#${log_el.old})` } \n\`\`Стало\`\` - ${log_el.new == undefined ? " " : `[Новые права](https://discordapi.com/permissions.html#${log_el.new})`}\n\`\`Внес изменения\`\` - \`\`${this.log.executor.username}#${this.log.executor.discriminator} - ${this.log.executor.id}\`\`\n\n`;
					break;
				case "permissions":
					strings_change = `${strings_change}**${log_el.key}:**\n\`\`Было\`\` - ${log_el.old == undefined ? " " : `[Старые права](https://discordapi.com/permissions.html#${log_el.old})` } \n\`\`Стало\`\` - ${log_el.new == undefined ? " " : `[Новые права](https://discordapi.com/permissions.html#${log_el.new})`}\n\`\`Внес изменения\`\` - \`\`${this.log.executor.username}#${this.log.executor.discriminator} - ${this.log.executor.id}\`\`\n\n`;
					break;
				default:
					strings_change = `${strings_change}**${log_el.key}:**\n\`\`Было\`\` - ${log_el.old == undefined ? " " : log_el.old } \n\`\`Стало\`\` - ${log_el.new == undefined ? " " : log_el.new}\n\`\`Внес изменения\`\` - \`\`${this.log.executor.username}#${this.log.executor.discriminator} - ${this.log.executor.id}\`\`\n\n`;
					break;
			}

		});
		if (this.log.changes[0].key == "permissions" && ((this.log.extra && this.log.extra.constructor.name == "Role") || this.log.target.constructor.name == "Role")) {
			strings_change = `${strings_change}[Старые права](https://discordapi.com/permissions.html#${this.log.changes[0].old})\n[Новые права](https://discordapi.com/permissions.html#${this.log.changes[0].new})\n`;
		}
		strings_change = `${strings_change}\n**Где изменения - **${this.log.target.toString() == "[object Object]" ? " " : this.log.target.toString()}`;
		return strings_change;
	}
	get_string_roles(roles) {
		let string_roles = "";
		roles.forEach(role => {
			if (role.allow) {
				if (role.type == 0) {
					string_roles = `${string_roles}\n<@&${role.id}> : [Разрешения](https://discordapi.com/permissions.html#${role.allow}) [Запреты](https://discordapi.com/permissions.html#${role.deny})`;
				} else if (role.type == 1) {
					string_roles = `${string_roles}\n<@${role.id}> : [Разрешения](https://discordapi.com/permissions.html#${role.allow}) [Запреты](https://discordapi.com/permissions.html#${role.deny})`;
				} else {
					string_roles = `${string_roles}\n<#${role.id}> : [Разрешения](https://discordapi.com/permissions.html#${role.allow}) [Запреты](https://discordapi.com/permissions.html#${role.deny})`;
				}

			} else {
				string_roles = `${string_roles}<@&${role.id}>, `;
			}

		});
		return string_roles;
	}
}
class Guild_logs_system extends Base_lib {
	constructor(Bot) {
		super(Bot);
		//
	}
	init() {
		this.set_handlers();
	}
	set_handlers() {
		const callback_guild_update = (old_guild, new_guild) => {
			this.send_log(new_guild);
		};
		const callback_update = (old, new_) => {
			this.send_log(new_.guild);
		};
		const callback_create_delete = (new_) => {
			this.send_log(new_.guild);
		};
		this.reg_callback("guildUpdate", callback_guild_update);
		this.reg_callback("channelUpdate", callback_update);
		this.reg_callback("roleUpdate", callback_update);
		this.reg_callback("guildMemberUpdate", callback_update);

		this.reg_callback("channelCreate", callback_create_delete);
		this.reg_callback("channelDelete", callback_create_delete);
		this.reg_callback("roleCreate", callback_create_delete);
		this.reg_callback("roleDelete", callback_create_delete);
	}
	send_log(guild) {
		guild.client.Db_manager.get_server(guild).then((server_db) => {
			const logs = Number(server_db.get("log_guild"));
			if (logs == 0) return;
			const chanel_id = server_db.get("log_channel");
			if (chanel_id == null || chanel_id == undefined) return;
			let channel = null;
			if (chanel_id != null) {
				channel = guild.channels.cache.get(chanel_id);
			}
			this.get_audit_log(guild).then(log => {
				channel.send({ "embeds": [new Log_guild_settings(log).get_embed()] });
			});
		});
	}
	get_audit_log(guild) {
		return new Promise((resolve, reject) => {
			guild.fetchAuditLogs().then(audit => {
				resolve(audit.entries.first());
			});
		});
	}
}
module.exports = (Bot) => {
	if (Bot.Guild_logs_system) {
		Bot.Guild_logs_system.destroy();
		Bot.Guild_logs_system = null;
	}
	// Bot.Guild_logs_system = new Guild_logs_system(Bot);
	// Bot.Guild_logs_system.init();
};