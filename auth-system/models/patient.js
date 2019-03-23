var Sequelize = require('sequelize');

// create a sequelize instance with our local postgres database information.
var sequelize = new Sequelize('postgres://postgres@localhost:5432/auth-system');

// setup Patient model and its fields.
var Patient = sequelize.define('patient', {
     firstname: {
        type: Sequelize.STRING,
        unique: false,
        allowNull: false
    },
     lastname: {
        type: Sequelize.STRING,
        unique: false,
        allowNull: false
    },
    age: {
        type: Sequelize.INTEGER,
        unique: false,
        allowNull: false
    },
    bloodtype: {
        type: Sequelize.STRING,
        unique: false,
        allowNull: false
    },
	uniqueid: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
	gender: {
        type: Sequelize.STRING,
        unique: false,
        allowNull: false
    },
	weight: {
        type: Sequelize.INTEGER,
        unique: false,
        allowNull: false
    },
	description: {
        type: Sequelize.STRING,
        unique: false,
        allowNull: false
    }
	
});

// create all the defined tables in the specified database.
sequelize.sync()
    .then(() => console.log('patient table has been successfully created, if it doesn\'t exist'))
    .catch(error => console.log('This error occured', error));

// export User model for use in other files.
module.exports = Patient;