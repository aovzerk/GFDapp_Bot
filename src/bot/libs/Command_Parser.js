class Parser_msg {
	constructor(Bot, msg) {
		this.Bot = Bot;
		this.msg = msg;
	}
	parse(server_db) {
		const channels_command = this.get_channels_command(server_db);
		if (channels_command != null && channels_command.indexOf(this.msg.channel.id) == -1) return;
		const prefix = server_db.get("prefix");
		const command = this.get_command(prefix);
		if (command == undefined || command == null) return;
		const args_msg = this.get_msg_args();
		command.run({
			"Bot": this.Bot,
			"msg": this.msg,
			"args": args_msg,
			"server_db": server_db
		});
	}
	get_channels_command(server_db) {
		const _channels_str = server_db.get("channels_read_command");
		if (_channels_str == null) return null;
		const array_channels = _channels_str.split(",");
		return array_channels;
	}
	get_msg_args() {
		let args = this.get_command_text().split(" ");
		args = args.filter(entery => entery.trim() != "");
		args.push("");
		return args;
	}
	get_command(prefix) {
		const comm_name = this.get_command_name();
		if (comm_name.startsWith(prefix)) {
			return this.Bot.commands.get(comm_name.replace(prefix, ""));
		} else {
			return null;
		}

	}
	get_command_name() {
		const comm = this.get_command_text();
		return comm.slice(0, comm.indexOf(" "));
	}
	get_command_text() {
		return `${this.msg.content.trim()} `;
	}
}
class Parser_interaction {
	constructor(Bot, interaction) {
		this.Bot = Bot;
		this.interaction = interaction;
	}
	parse(server_db) {
		if (!this.interaction.isCommand()) return;
		const command = this.get_command();
		if (command == undefined) return;
		command.run({
			"Bot": this.Bot,
			"inter": this.interaction,
			"server_db": server_db
		});
	}
	get_command() {
		return this.Bot.commands_slash.get(this.interaction.commandName);
	}
}
class Command_Parser {

	constructor(Bot) {
		this.Bot = Bot;
	}
	get_parser(obj) {
		let parser = null;
		switch (obj.constructor.name) {
			case "Message":
				parser = new Parser_msg(this.Bot, obj);
				break;
			case "CommandInteraction":
				parser = new Parser_interaction(this.Bot, obj);
				break;
			default:
				break;
		}
		return parser;
	}
}
module.exports = (Bot) => {
	Bot.Command_Parser = new Command_Parser(Bot);
};