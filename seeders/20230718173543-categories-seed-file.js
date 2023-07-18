'use strict'
const categories = [
  '家電',
  '手機',
  '電腦',
  '保健',
  '食品',
  '彩妝',
  '服裝',
  '日用品',
  '家具',
  '運動'
]

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Categories',
      categories.map(item => {
        return {
          name: item,
          created_at: new Date(),
          updated_at: new Date()
        }
      }))
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Categories', {})
  }
}
