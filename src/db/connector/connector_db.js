const { Sequelize } = require("sequelize");
const config_db = require("../../../configs/db.json");
const connector_db = new Sequelize(config_db.db_name, config_db.user, config_db.password, {
	"host": config_db.host,
	"dialect": config_db.dialect,
	"define": {
		"timestamps": false
	},
	"logging": false
});
module.exports = connector_db;