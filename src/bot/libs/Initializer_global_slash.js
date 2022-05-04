const fetch = require("node-fetch");

class Initializer_global_slash {
	constructor(Bot) {
		this.Bot = Bot;
		this._start = 0;
		this.commands = [
			{
				"name": "get_prefix",
				"description": "Узнать префикс сервера"
			},
			{
				"name": "anti_spam",
				"description": "управление анти спамом на сервере",
				"options": [
					{
						"name": "status",
						"description": "Включение или выключение анти спама",
						"type": 4,
						"required": true,
						"choices": [
							{
								"name": "on",
								"value": 1
							},
							{
								"name": "off",
								"value": 0
							}
						]
					}
				],
				"default_member_permissions": 8
			},
			{
				"name": "new_members",
				"description": "Включение или выключение оповещения о новых юзерах",
				"options": [
					{
						"name": "enable",
						"description": "Включение о новых юзерах",
						"type": 1,
						"options": [
							{
								"name": "channel",
								"description": "канал для отправки оповещений",
								"channel_types": [0],
								"type": 7,
								"required": true
							}
						]

					},
					{
						"name": "disable",
						"description": "Выключение оповещения о новых юзерах",
						"type": 1
					}
				],
				"default_member_permissions": 8
			},
			{
				"name": "channel_stat",
				"description": "управление каналами статистики",
				"options": [
					{
						"name": "status",
						"description": "Включение или выключение каналов статистики",
						"type": 4,
						"required": true,
						"choices": [
							{
								"name": "on",
								"value": 1
							},
							{
								"name": "off",
								"value": 0
							}
						]
					}
				],
				"default_member_permissions": 8
			},
			{
				"name": "private_channel",
				"description": "управление приватными каналами",
				"options": [
					{
						"name": "status",
						"description": "Включение или выключение приватных каналов",
						"type": 4,
						"required": true,
						"choices": [
							{
								"name": "on",
								"value": 1
							},
							{
								"name": "off",
								"value": 0
							}
						]
					}
				],
				"default_member_permissions": 8
			},
			{
				"name": "help",
				"description": "Список команд"
			},
			{
				"name": "anti_url",
				"description": "управление анти ссылками",
				"options": [
					{
						"name": "status",
						"description": "Включение или выключение анти ссылки",
						"type": 4,
						"required": true,
						"choices": [
							{
								"name": "on",
								"value": 1
							},
							{
								"name": "off",
								"value": 0
							}
						]
					}
				],
				"default_member_permissions": 8
			},
			{
				"name": "idea",
				"description": "Ваша идея для бота"
			},
			{
				"name": "Аватарка",
				"type": 2
			},
			{
				"name": "Обнять",
				"type": 2
			},
			{
				"name": "Погладить",
				"type": 2
			},
			{
				"name": "Баннер",
				"type": 2
			},
			{
				"name": "Перевести на RUS",
				"type": 3
			},
			{
				"name": "Перевести на ENG",
				"type": 3
			}
		];
	}
	init() {
		this.set_handler();
	}
	set_handler() {
		this.Bot.once("ready", (Client) => {
			this.create_slash(Client);
		});
	}
	create_slash(Client) {
		// this.delete_commands(Client, ["Перевести на русский", "Перевести на английский"]);
		if (this._start) {
			const url = `https://discord.com/api/v9/applications/${Client.user.id}/commands`;
			this.commands.forEach((command, i) => {
				setTimeout(() => this.send_data({ "method": "POST", "body": JSON.stringify(command), "url": url, "token": global.main_config.token }), i * 5000);
			});
		}

	}
	send_data(options) {
		const { method, body, url, token } = options;
		let { get_json } = options;
		if (get_json == undefined) get_json = true;
		return new Promise((result, reject) => {
			fetch(url, {
				"method": method,
				"body": body,
				"headers": {
					"Authorization": `Bot ${token}`,
					"Content-Type": "application/json"
				}
			}).then(response => {
				response.json().then(data => {
					if (data.global == false) {
						console.log(data);
					} else {
						console.log(`COMMANDS SLASH GLOBAL ${data.name} команда проинициализирвоана`);
					}
				});
			}).catch(err => reject(err));
		});
	}
	delete_commands(Client, commands) {
		Client.application.commands.fetch().then(f_commands => {
			f_commands.forEach(command => {
				commands.forEach(d_command => {
					if (command.name == d_command) {
						Client.application.commands.delete(command.id).then(() => console.log(`DELETE G COMM ${d_command} удалена`));
					}
				});
			});
		});

	}
}
module.exports = (Bot) => {
	Bot.Initializer_global_slash = new Initializer_global_slash(Bot);
	Bot.Initializer_global_slash.init();
};