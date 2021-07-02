import path from 'path';

module.exports = {
  development: {
    dialect: 'mysql',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_DBNAME || 'pickyplay',
    username: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD,
    storage: ':memory:',
    models: [path.join(__dirname, 'models')],
    modelMatch: (filename, member) => {
      return filename.substring(0, filename.indexOf('.model')) === member.toLowerCase();
    },
    port: process.env.DB_PORT || 3306,
  },
};
