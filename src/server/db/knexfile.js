module.exports = {

  development: {
    client: 'mysql',
    connection: {
      host: '127.0.0.1',
    	user: 'root',
    	password: '',
    	database: 'hanginhubs_dev'
    },
    // seeds: {directory: './seeds'}
  },
  production: { 
  	client: 'mysql', 
  	connection: process.env.DATABASE_URL
  }
};
