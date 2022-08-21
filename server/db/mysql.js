var mysql = require('mysql');
var connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: 'admin123',
	database: 'uni-app'
});
module.exports = connection
