const { Product, Category } = require('../models')
const { Op } = require('sequelize')

const productController = {
  getProducts: async (req, res, next) => {
    // 取得查詢參數
    const { categoryId, lowestPrice, highestPrice, keyword, sortBy } = req.query
    const query = { isPublic: true }
    const order = []
    if (highestPrice) {
      query.price = { [Op.lte]: highestPrice }
    }
    if (lowestPrice) {
      query.price = { [Op.gte]: lowestPrice }
    }
    if (!sortBy || sortBy === 'new') {
      order.push(['createdAt', 'DESC'])
    } else if (sortBy === 'highprice') {
      order.push(['price', 'DESC'])
    } else if (sortBy === 'lowprice') {
      order.push(['price', 'ASC'])
    } else {
      order.push(['createdAt', 'DESC'])
    }
    // 取得商品資料
    try {
      if (keyword) { // 如果關鍵字有值，查詢關鍵字
        query.name = { [Op.like]: `%${keyword}%` }
        const products = await Product.findAll({
          where: query,
          order
        })
        return res.json({ status: 'success', data: products })
      } else if (categoryId) { // 如果分類ID有值，查詢分類ID
        const products = await Product.findAll({
          where: query,
          include: [
            {
              model: Category,
              attributes: ['id'],
              as: 'Categories',
              where: { id: categoryId }
            }
          ],
          order
        })
        return res.json({ status: 'success', data: products })
      }
    } catch (err) {
      next(err)
    }
  }
}

module.exports = productController
