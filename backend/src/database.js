const { Sequelize } = require('sequelize');
const path = require('path');

// Initialize Sequelize with SQLite
const sequelize = new Sequelize({
  dialect: 'sqlite', // tells the sequelize that I am using sqlite
  storage: path.join(__dirname, '../database.sqlite'), //location for the sqlite database
  logging: process.env.NODE_ENV !== 'production' ? console.log : false
});

// Test the connection
async function testConnection() {
  try {
    // await is used to pause execution of an async function until a Promise is resolved.
    // without wait js doesnt wait for the connection ton finsih which causes issues
    await sequelize.authenticate(); //waits to checks to see if Sequelize can connect to the DB.
    console.log('Database connection established successfully.');
  } catch (error) { // if error then go to the catch block
    console.error('Unable to connect to the database:', error);
  }
}

testConnection(); //immediatelyu called to test the database

module.exports = { sequelize }; // exports the sequelize instance to use elsewhere in the project