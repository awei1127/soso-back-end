'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Product.belongsTo(models.User, { foreignKey: 'ownerId' })
      Product.hasMany(models.CartItem, { foreignKey: 'productId' })
      Product.hasMany(models.OrderItem, { foreignKey: 'productId' })
      Product.belongsToMany(models.Category, {
        through: models.ProductCategory,
        foreignKey: 'productId',
        as: 'Categories'
      })
    }
  }
  Product.init({
    ownerId: DataTypes.INTEGER,
    price: DataTypes.INTEGER,
    stock: DataTypes.INTEGER,
    name: DataTypes.STRING,
    description: DataTypes.TEXT,
    public: DataTypes.BOOLEAN,
    image: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Product',
    tableName: 'Products',
    underscored: true
  })
  return Product
}
