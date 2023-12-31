const { Product, Category } = require('../models')
const { Op } = require('sequelize')
const { getOffset, getPagination } = require('../helpers/pagination-helpers')

const productController = {
  getProducts: async (req, res, next) => {
    // 取得查詢參數
    const DEFAULT_LIMIT = 20
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || DEFAULT_LIMIT
    const offset = getOffset(page, limit)
    const { categoryId, lowestPrice, highestPrice, keyword, sortBy } = req.query
    const query = { isPublic: true }
    const order = []
    if (highestPrice && highestPrice > 0) {
      query.price = { ...query.price, [Op.lte]: highestPrice }
    }
    if (lowestPrice && lowestPrice >= 0) {
      query.price = { ...query.price, [Op.gte]: lowestPrice }
    }
    if (!sortBy || sortBy === 'newest') {
      order.push(['createdAt', 'DESC'])
    } else if (sortBy === 'highestPrice') {
      order.push(['price', 'DESC'])
    } else if (sortBy === 'lowestPrice') {
      order.push(['price', 'ASC'])
    } else {
      order.push(['createdAt', 'DESC'])
    }
    // 取得商品資料
    try {
      if (keyword) { // 如果關鍵字有值，查詢關鍵字
        query.name = { [Op.like]: `%${keyword}%` }
        const products = await Product.findAndCountAll({
          where: query,
          limit,
          offset,
          order
        })
        const data = {
          products: products.rows,
          pagination: getPagination(page, limit, products.count)
        }
        return res.json({ status: 'success', data })
      } else if (categoryId) { // 如果分類ID有值，查詢分類ID
        const products = await Product.findAndCountAll({
          where: query,
          include: [
            {
              model: Category,
              attributes: ['id'],
              as: 'Categories',
              where: { id: categoryId }
            }
          ],
          limit,
          offset,
          order
        })
        const data = {
          products: products.rows,
          pagination: getPagination(page, limit, products.count)
        }
        return res.json({ status: 'success', data })
      } else { // 如果關鍵字跟分類ID都沒有值，查詢所有產品
        const products = await Product.findAndCountAll({
          where: query,
          limit,
          offset,
          order
        })
        const data = {
          products: products.rows,
          pagination: getPagination(page, limit, products.count)
        }
        return res.json({ status: 'success', data })
      }
    } catch (err) {
      next(err)
    }
  }
}

module.exports = productController
