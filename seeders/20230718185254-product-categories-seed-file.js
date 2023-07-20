'use strict'
const { Category, Product } = require('../models')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // 先取得目前資料庫中的categories跟products的數量
    const countCategories = Category.count()
    const countProducts = Product.count()
    const [categoryAmount, productAmount] = await Promise.all([countCategories, countProducts])

    // 每個產品隨機分配category_id
    await queryInterface.bulkInsert('ProductCategories',
      Array.from({ length: productAmount }, (_, i) => ({
        product_id: i + 1,
        category_id: [Math.floor(Math.random() * categoryAmount + 1)],
        created_at: new Date(),
        updated_at: new Date()
      }))
    )
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('ProductCategories', {})
  }
}
