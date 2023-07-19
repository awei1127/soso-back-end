const { Category } = require('../models')

const categoryController = {
  getCategories: async (req, res, next) => {
    // 取得分類資料
    try {
      const categories = await Category.findAll()
      res.json({ status: 'success', data: categories })
    } catch (err) {
      next(err)
    }
  }
}

module.exports = categoryController
