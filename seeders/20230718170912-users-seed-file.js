'use strict'
const bcrypt = require('bcryptjs')
// 最多生成999個seller
const sellerAmount = 40

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // 新增user資料
    await queryInterface.bulkInsert('Users', [
      {
        account: 'buyer001',
        email: 'buyer001@example.com',
        name: 'buyer001',
        password: await bcrypt.hash('titaner', 10),
        role: 'user',
        created_at: new Date(),
        updated_at: new Date()
      }
    ])
    // 新增seller資料
    const sellers = []
    for (let i = 1; i < sellerAmount + 1; i++) {
      const numStr = String(i).padStart(3, '0')
      const seller = {
        account: `seller${numStr}`,
        email: `seller${numStr}@example.com`,
        name: `seller${numStr}`,
        password: await bcrypt.hash('titaner', 10),
        role: 'seller',
        created_at: new Date(),
        updated_at: new Date()
      }
      sellers.push(seller)
    }
    await queryInterface.bulkInsert('Users', sellers)
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', {})
  }
}
