const { DataTypes, Model } = require("sequelize");
const sequelize = require("../connector/connector_db");
const main_config = require("../../../configs/main_config.json");
class Server_m extends Model {}

Server_m.init({
	"Id": {
		"type": DataTypes.INTEGER,
		"autoIncrement": true,
		"primaryKey": true,
		"allowNull": false
	},
	"server_id": {
		"type": DataTypes.STRING,
		"allowNull": false
	},
	"channel_new_member": {
		"type": DataTypes.STRING,
		"allowNull": true,
		"defaultValue": null
	},
	"prefix": {
		"type": DataTypes.STRING,
		"allowNull": false,
		"defaultValue": main_config.prefix
	},
	"roles_add_nm": {
		"type": DataTypes.STRING,
		"allowNull": true,
		"defaultValue": null
	},
	"channel_stats_all": {
		"type": DataTypes.STRING,
		"allowNull": true,
		"defaultValue": null
	},
	"channel_stats_users": {
		"type": DataTypes.STRING,
		"allowNull": true,
		"defaultValue": null
	},
	"channel_stats_bots": {
		"type": DataTypes.STRING,
		"allowNull": true,
		"defaultValue": null
	},
	"channel_stats_category": {
		"type": DataTypes.STRING,
		"allowNull": true,
		"defaultValue": null
	},
	"channels_read_command": {
		"type": DataTypes.STRING,
		"allowNull": true,
		"defaultValue": null
	},
	"roles_add_voice": {
		"type": DataTypes.STRING,
		"allowNull": true,
		"defaultValue": null
	},
	"channel_privat": {
		"type": DataTypes.STRING,
		"allowNull": true,
		"defaultValue": null
	},
	"channel_caregory_privat": {
		"type": DataTypes.STRING,
		"allowNull": true,
		"defaultValue": null
	},
	"anti_spam": {
		"type": DataTypes.BOOLEAN,
		"allowNull": false,
		"defaultValue": false
	},
	"anti_url": {
		"type": DataTypes.BOOLEAN,
		"allowNull": false,
		"defaultValue": false
	}
}, {
	sequelize,
	"tableName": "servers"
});
module.exports = Server_m;