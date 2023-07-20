const { Product } = require('../models')
const { imgurFileHandler } = require('../helpers/file-helpers')

const shopController = {
  getProducts: async (req, res, next) => {
    // 用userId取得該使用者的商品清單
    const userId = req.user.id
    try {
      const products = await Product.findAll({ where: { ownerId: userId } })
      return res.json({ status: 'success', data: products })
    } catch (err) {
      next(err)
    }
  },
  addProduct: async (req, res, next) => {
    // 新增商品
    const { file } = req
    const userId = req.user.id
    const { name, description } = req.body
    let { price, stock, isPublic } = req.body
    let filePath
    if (!name || !price || !stock || !description || !isPublic) {
      return res.json({ status: 'failure', message: 'All required.' })
    }
    // 把multer處理過的form-data資料轉換成期望的型別
    try {
      isPublic = JSON.parse(isPublic)
      price = Number(price)
      stock = Number(stock)
    } catch (err) {
      next(err)
    }
    // 檢查price和stock是否大於0且是整數
    if (price <= 0 || stock <= 0 || !Number.isInteger(price) || !Number.isInteger(stock)) {
      return res.json({ status: 'failure', message: 'Invalid value.' })
    }
    try {
      if (file) {
        filePath = await imgurFileHandler(file)
      }
      const product = await Product.create({ ownerId: userId, name, price, stock, description, isPublic, image: filePath })
      return res.json({ status: 'success', data: product })
    } catch (err) {
      next(err)
    }
  },
  toggleProduct: async (req, res, next) => {
    // 下架商品
    const { productId } = req.body
    const userId = req.user.id
    try {
      const product = await Product.findOne({ where: { id: productId, ownerId: userId } })
      const toggledProduct = await product.update({ isPublic: !product.isPublic })
      return res.json({ status: 'success', data: toggledProduct })
    } catch (err) {
      next(err)
    }
  }
}

module.exports = shopController
