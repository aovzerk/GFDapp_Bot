class Initializer_global_slash {
	constructor(Bot) {
		this.Bot = Bot;
		this._start = 1;
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
				]
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
				]
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
				]
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
				]
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
		if (this._start) {
			Client.application.commands.set(this.commands).then(() => {
				console.log("Глобальные команды успешно установлены");
			}).catch(err => console.log(err));
		}

	}
}
module.exports = (Bot) => {
	Bot.Initializer_global_slash = new Initializer_global_slash(Bot);
	Bot.Initializer_global_slash.init();
};
