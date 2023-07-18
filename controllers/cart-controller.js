const { CartItem } = require('../models')

const cartController = {
  getCartItems: async (req, res, next) => {
    // 用userId取得該使用者的購物車物品清單(cartItems)
    const userId = req.user.toJSON().id
    try {
      const cartItems = await CartItem.findAll({ where: { userId } })
      return res.json({ status: 'success', data: cartItems })
    } catch (err) {
      next(err)
    }
  }
}

module.exports = cartController
