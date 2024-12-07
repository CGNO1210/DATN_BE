'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  User.init({
    nameUser: DataTypes.STRING,
    avatar: {
      type: DataTypes.STRING,
      defaultValue: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Unknown_person.jpg/813px-Unknown_person.jpg'
    },
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    isOnline: {
      type: DataTypes.BOOLEAN,
      defaultValue: 0
    },
    socketId: {
      type: DataTypes.STRING,
      defaultValue: ''
    },
    device: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};