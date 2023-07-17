'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Category extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Category.hasMany(models.ProductCategory, { foreignKey: 'categoryId' })
      Category.belongsTo(models.Category, { foreignKey: 'parentId' })
      Category.belongsToMany(models.Product, {
        through: models.ProductCategory,
        foreignKey: 'categoryId',
        as: 'Products'
      })
    }
  }
  Category.init({
    name: DataTypes.STRING,
    parentId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Category',
    tableName: 'Categories',
    underscored: true
  })
  return Category
}
