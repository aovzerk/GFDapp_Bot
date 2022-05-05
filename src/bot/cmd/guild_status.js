/* eslint-disable max-nested-callbacks */
const { MessageEmbed } = require("discord.js");
const Base_Command = require("./Class_Command/Base_Command");
const name_command = "guild_status";
const description_command = global.config_cmd[name_command];


/*
----args----

    "Bot" - сам бот
	"msg" - сообщение которое вызвало эту функцию
	"args" - аргументы этого сообщения
	"server_db" - модель сервера в базе данных

----args----
*/

class Command extends Base_Command {
	constructor(description) {
		super(description);
	}
	run(args) {
		const prefix = `\`\`${args.server_db.get("prefix")}\`\``;
		const roles_nm = args.server_db.get("roles_add_nm") == null ? "``Выключено``" : this.get_roles_str(args.server_db.get("roles_add_nm"));
		let channel_stats = "``Выключены``";
		if (args.server_db.get("channel_stats_all") != null) {
			channel_stats = `<#${args.server_db.get("channel_stats_all")}>, `;
			channel_stats = `${channel_stats}<#${args.server_db.get("channel_stats_users")}>, `;
			channel_stats = `${channel_stats}<#${args.server_db.get("channel_stats_bots")}>`;
		}
		const channel_new_member = args.server_db.get("channel_new_member") == null ? "``Выключено``" : `<#${args.server_db.get("channel_new_member")}>`;
		const channels_read_commands = args.server_db.get("channels_read_command") == null ? "``Выключено``" : this.get_channels(args.server_db.get("channels_read_command"));
		const roles_voice = args.server_db.get("roles_add_voice") == null ? "``Выключено``" : this.get_roles_str(args.server_db.get("roles_add_voice"));
		const channel_privat = args.server_db.get("channel_privat") == null ? "``Выключено``" : `<#${args.server_db.get("channel_privat")}>`;
		const anti_spam = Number(args.server_db.get("anti_spam")) == 0 ? "``Выключена``" : "``Включена``";
		const anti_url = Number(args.server_db.get("anti_url")) == 0 ? "``Выключена``" : "``Включена``";
		const bump = Number(args.server_db.get("bump")) == 0 ? "``Выключены``" : "``Включены``";
		const roles_bump = args.server_db.get("roles_bump") == null ? "``Выключено``" : this.get_roles_str(args.server_db.get("roles_bump"));
		const channel_bump = args.server_db.get("channel_bump") == null ? "``Выключено``" : `<#${args.server_db.get("channel_bump")}>`;
		const auto_kick = Number(args.server_db.get("auto_kick")) == 0 ? "``Выключена``" : "``Включена``";
		const log_channel = args.server_db.get("log_channel") == null ? "``Выключено``" : this.get_channels(args.server_db.get("log_channel"));
		const options = {
			"description": `Информация о сервере [**${args.msg.guild.toString()}**]`,
			"fields": [
				{
					"name": "ID",
					"value": `\`\`\`diff\n- ${args.msg.guild.id}\n\`\`\``
				},
				{
					"name": "Префикс",
					"value": prefix
				},
				{
					"name": "Всего участников",
					"value": `\`\`\`yaml\n${args.msg.guild.memberCount}\n\`\`\``
				},
				{
					"name": "Оповещения о новых юзерах",
					"value": channel_new_member
				},
				{
					"name": "Роли новым юзерам",
					"value": roles_nm
				},
				{
					"name": "Каналы статистики",
					"value": channel_stats
				},
				{
					"name": "Каналы считывания команд",
					"value": channels_read_commands
				},
				{
					"name": "Роли при заходе в войс",
					"value": roles_voice
				},
				{
					"name": "Канал для создания приваток",
					"value": channel_privat
				},
				{
					"name": "Опция Анти спам",
					"value": anti_spam
				},
				{
					"name": "Опция Анти ссылки",
					"value": anti_url
				},
				{
					"name": "Опция напоминания бампов",
					"value": `\`\`Оповещения\`\` - ${bump}\n\`\`Роли бампа\`\` - ${roles_bump}\n\`\`Канал оповещений\`\` - ${channel_bump}`
				},
				{
					"name": "Опция авто кика",
					"value": auto_kick
				},
				{
					"name": "Канал логов",
					"value": log_channel
				}
			]
		};
		if (args.msg.guild.icon != null || args.msg.guild.icon != undefined) {
			options.thumbnail = {
				"url": args.msg.guild.iconURL({ "size": 1024, "dynamic": true })
			};
		}
		if (args.msg.guild.banner != null || args.msg.guild.banner != undefined) {
			options.image = {
				"url": args.msg.guild.bannerURL({ "size": 1024, "dynamic": true })
			};
		}
		const embed = new MessageEmbed(options);
		args.msg.channel.send({ "embeds": [embed] });
	}
	get_roles_str(roles) {
		const temp_array_roles = roles.split(",");
		let roles_nm = "";
		temp_array_roles.forEach(role => {
			roles_nm = `${roles_nm }<@&${ role }>, `;
		});
		return roles_nm;
	}
	get_channels(channels) {
		const temp_array_channels = channels.split(",");
		let _channels = "";
		temp_array_channels.forEach(channel => {
			_channels = `${_channels }<#${ channel }>, `;
		});
		return _channels;
	}


}
module.exports = new Command(description_command);