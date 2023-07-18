'use strict'
const faker = require('faker')
const productAmount = 800
const minPrice = 30
const maxPrice = 2000
const stock = 20

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // 先取得目前資料庫中的users
    const users = await queryInterface.sequelize.query(
      'SELECT id FROM users;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    // 生成商品並隨機分配owner_id
    await queryInterface.bulkInsert('Products',
      Array.from({ length: productAmount }, () => ({
        owner_id: users[Math.floor(Math.random() * users.length)].id,
        price: Math.floor(Math.random() * (maxPrice - minPrice) + minPrice),
        stock,
        name: faker.name.findName(),
        description: faker.lorem.text(),
        public: true,
        image: `https://loremflickr.com/320/320/restaurant,food/?random=${Math.random() * 100}`,
        created_at: new Date(),
        updated_at: new Date()
      }))
    )
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Restaurants', {})
  }
}
