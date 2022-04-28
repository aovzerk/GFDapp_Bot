const { MessageEmbed } = require("discord.js");
class Base_Command {
	constructor(description) {
		this.description = description;
	}
	/*
----args----

    "Bot" - сам бот
	"msg" - сообщение которое вызвало эту функцию
	"args" - аргументы этого сообщения
	"server_db" - модель сервера в базе данных

----args----
*/
	run(args) {
		console.log(`deffault log ${ this.description.name}`);
	}
	check_admin(member) {
		return member.permissions.has("ADMINISTRATOR");
	}
	chech_role(role_id, guild) {
		const is_role = guild.roles.cache.get(role_id);
		if (is_role) return true;
		return false;
	}
	chech_channel(channel_id, guild) {
		const is_channel = guild.channels.cache.get(channel_id);
		if (is_channel) return true;
		return false;
	}
	sendError(args) {
		this.sendEmbed({ "mess": args.mess, "description": args.description_error, "title": `Ошибка команды \`\`${this.description.name}\`\` ` });
	}
	sendEmbed(cfg) {
		const embed = new MessageEmbed();
		// embed.setColor("#aa12a6");
		embed.setTitle(cfg.title);
		embed.setDescription(cfg.description);
		embed.setAuthor({ "name": cfg.mess.author.username, "iconURL": cfg.mess.author.avatarURL() });
		if (cfg.image != undefined || cfg.image != null) {
			embed.setImage(cfg.image);
		}
		cfg.mess.channel.send({ "embeds": [embed] }).then(new_msg => {
			if (cfg.delete == true) {
				setTimeout(() => { new_msg.delete();}, 5000);
			}
		});

	}
}
module.exports = Base_Command;