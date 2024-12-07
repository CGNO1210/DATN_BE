import { Sequelize } from 'sequelize';

// // Option 1: Passing a connection URI
// const sequelize = new Sequelize('sqlite::memory:') // Example for sqlite
// const sequelize = new Sequelize('postgres://user:pass@example.com:5432/dbname') // Example for postgres

// // Option 2: Passing parameters separately (sqlite)
// const sequelize = new Sequelize({
//   dialect: 'sqlite',
//   storage: 'path/to/database.sqlite'
// });

// Option 3: Passing parameters separately (other dialects)


require('dotenv').config();

const sequelize = new Sequelize(process.env.DB_DATABASE || 'bihljpjimepuk9ie7yeh',
  process.env.DB_USERNAME || 'usapp5gumjb07aok',
  // process.env.DB_PASSWORD || 'TMiEA09581y4ohfK01D6',
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST || 'bihljpjimepuk9ie7yeh-mysql.services.clever-cloud.com',
    dialect: 'mysql',
    logging: false
  });

let connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

export default connectDB