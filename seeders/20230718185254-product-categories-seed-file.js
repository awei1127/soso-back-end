'use strict'
const { Category, Product } = require('../models')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // 先取得目前資料庫中的categories跟products
    const categories = Category.findAll()
    const products = Product.findAll()
    const [categoryData, productData] = await Promise.all([categories, products])

    // 每個產品隨機分配category_id
    await queryInterface.bulkInsert('ProductCategories',
      productData.map(product => ({
        product_id: product.id,
        category_id: categoryData[Math.floor(Math.random() * categoryData.length)].id,
        created_at: new Date(),
        updated_at: new Date()
      }))
    )
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('ProductCategories', {})
  }
}
