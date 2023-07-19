const { CartItem } = require('../models')

const cartController = {
  getCartItems: async (req, res, next) => {
    // 用userId取得該使用者的購物車物品清單(cartItems)
    const userId = req.user.id
    try {
      const cartItems = await CartItem.findAll({ where: { userId } })
      return res.json({ status: 'success', data: cartItems })
    } catch (err) {
      next(err)
    }
  },
  addCartItem: async (req, res, next) => {
    // 將特定商品加入購物車物品清單
    const { productId } = req.body
    const userId = req.user.id
    const checked = true
    try {
      const cartItem = await CartItem.create({ userId, productId, checked })
      return res.json({ status: 'success', data: cartItem })
    } catch (err) {
      next(err)
    }
  },
  removeCartItem: async (req, res, next) => {
    // 將購物車物品從購物車物品清單移除
    const { cartItemId } = req.body
    const userId = req.user.id
    try {
      const cartItem = await CartItem.findOne({ where: { id: cartItemId, userId } })
      const removedCartItem = await cartItem.destroy()
      return res.json({ status: 'success', data: removedCartItem })
    } catch (err) {
      next(err)
    }
  },
  toggleCartItem: async (req, res, next) => {
    // 更改購物車物品的勾選狀態
    const { cartItemId } = req.body
    const userId = req.user.id
    try {
      const cartItem = await CartItem.findOne({ where: { id: cartItemId, userId } })
      const toggledCartItem = await cartItem.update({ checked: !cartItem.checked })
      return res.json({ status: 'success', data: toggledCartItem })
    } catch (err) {
      next(err)
    }
  }
}

module.exports = cartController
