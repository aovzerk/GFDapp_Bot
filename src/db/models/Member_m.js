const { DataTypes, Model } = require("sequelize");
const sequelize = require("../connector/connector_db");
class Member_m extends Model {}

Member_m.init({
	"Id": {
		"type": DataTypes.INTEGER,
		"autoIncrement": true,
		"primaryKey": true,
		"allowNull": false
	},
	"member_id": {
		"type": DataTypes.STRING,
		"allowNull": false
	},
	"guild_id": {
		"type": DataTypes.STRING,
		"allowNull": false
	},
	"balance": {
		"type": DataTypes.STRING,
		"allowNull": false,
		"defaultValue": 0
	},
	"next_work": {
		"type": DataTypes.STRING,
		"allowNull": false,
		"defaultValue": 0
	}
}, {
	sequelize,
	"tableName": "members"
});
module.exports = Member_m;