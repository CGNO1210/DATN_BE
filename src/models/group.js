'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Group extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Group.init({
    nameGroup: DataTypes.STRING,
    avatarGroup: {
      type: DataTypes.STRING,
      defaultValue: 'https://history-day-by-day.com/wp-content/uploads/2016/12/ruga.jpg'
    },
    ownGroup: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Group',
  });
  return Group;
};