'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class MessagesGroup extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  MessagesGroup.init({
    idSend: DataTypes.INTEGER,
    idReceive: DataTypes.INTEGER,
    content: DataTypes.STRING,
    isGroup: DataTypes.BOOLEAN,
    type: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'MessagesGroup',
  });
  return MessagesGroup;
};