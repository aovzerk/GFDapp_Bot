const { MessageEmbed } = require("discord.js");
const Base_Command = require("./Class_Command/Base_Command");
const name_command = "anti_url";
const description_command = global.config_slash[name_command];

/*
----args----

    "Bot" - сам бот
	"inter" - interaction которое вызвало эту функцию
	"server_db" - серверв в базе данных
---
*/

class Command extends Base_Command {
	constructor(description) {
		super(description);// GIVE_PERM
		this.command_url = {
			"name": "url",
			"description": "Скинуть url в чат",
			"options": [
				{
					"name": "url",
					"type": 3,
					"description": "url",
					"required": true
				},
				{
					"name": "url2",
					"type": 3,
					"description": "url",
					"required": false
				},
				{
					"name": "url3",
					"type": 3,
					"description": "url",
					"required": false
				},
				{
					"name": "url4",
					"type": 3,
					"description": "url",
					"required": false
				}
			]
		};
	}
	run(args) {
		const embed = new MessageEmbed();
		if (!this.check_admin(args.inter.member)) {
			embed.setDescription("У вас нет права **Администратор**");
			return args.inter.reply({ "embeds": [embed], "ephemeral": true });
		}
		if (!this.check_admin(args.inter.guild.me)) {
			embed.setDescription("У **Бота** нет права **Администратор**");
			return args.inter.reply({ "embeds": [embed], "ephemeral": true });
		}
		const status_anti_url = args.inter.options.getInteger("status");
		const anti_url_opts = Number(args.server_db.get("anti_url"));

		if (status_anti_url == 1) {
			if (anti_url_opts == 1) {
				embed.setDescription("На сервере уже **включен** анти cсылки");
			} else if (anti_url_opts == 0) {
				embed.setDescription("На сервере успешно **включен** анти cсылки");
				args.inter.guild.commands.create(this.command_url).then(() => console.log("Создана /url")).catch((err) => console.log(err));
				args.server_db.set("anti_url", 1);
			}
		} else if (status_anti_url == 0) {
			if (anti_url_opts == 1) {
				embed.setDescription("На сервере успешно **выключен** анти cсылки");
				args.inter.guild.commands.fetch().then(commands => {
					commands.forEach(command => {
						if (command.name == "url") {
							args.inter.guild.commands.delete(command.id).then(() => console.log("Удаена /url")).catch((err) => console.log(err));
						}
					});
				});
				args.server_db.set("anti_url", 0);
			} else if (anti_url_opts == 0) {
				embed.setDescription("На сервере уже **выключен** анти cсылки");
			}
		}
		args.inter.reply({ "embeds": [embed], "ephemeral": true });
		args.server_db.save();
	}
}
module.exports = new Command(description_command);