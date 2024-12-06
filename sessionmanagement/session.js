
require('dotenv').config();
const mysq_store_session_database_options = {
    host: process.env.SESSION_DATABASE_HOST,
    port: process.env.SESSION_DATABASE_PORT,
    user: process.env.SESSION_DATABASE_USER,
    password: process.env.SESSION_DATABASE_PASSWORD,
    database: process.env.SESSION_DATABASE_NAME,
    clearExpired: true,
    checkExpirationInterval: process.env.MYSQL_SESSION_MAXIMUM_EXPIRE_TIME_IN_MILLI_SECONDS, // 15 minutes in milli seconds
    createDatabaseTable: false,
    schema: {
		tableName: 'sessions',
		columnNames: {
			session_id: 'session_id',
			expires: 'expires',
			data: 'data'
		}
	}
};

exports.mysq_store_session_database_options = mysq_store_session_database_options;

