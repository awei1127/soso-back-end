const { sequelize, Order, OrderItem, CartItem, Product } = require('../models')

const orderController = {
  // 新增訂單
  addOrder: async (req, res, next) => {
    // 取得打勾的cartItems並整理成商品與數量(orderedProducts)
    const userId = req.user.id
    const orderedProducts = await CartItem.findAll({
      where: { userId, checked: true },
      attributes: [
        ['product_id', 'productId'], // 使用使用聚合函數時不會自動轉換，所以使用 as 別名
        [sequelize.fn('COUNT', sequelize.col('product_id')), 'quantity']
      ],
      group: ['product_id'],
      raw: true,
      nest: true
    })

    // 建立一個交易
    const transaction = await sequelize.transaction()

    // 根據商品與數量(orderedProducts)檢查各product庫存
    try {
      // 對目標商品加鎖，取得商品最新資料
      const productInfoList = await Promise.all(Array.from(
        orderedProducts,
        (e, _) => Product.findByPk(e.productId, { raw: true, lock: transaction.LOCK.UPDATE, transaction })
      ))

      // 如果沒有商品資料，或庫存不足，或為下架狀態，就丟出庫存不足的錯誤訊息
      orderedProducts.forEach(orderedProduct => {
        const productInfo = productInfoList.find(p => p.id === orderedProduct.productId)
        if (!productInfo || orderedProduct.quantity > productInfo.stock || !productInfo.isPublic) {
          throw new Error(`${productInfo.name} not enough stock.`)
        }
      })

      // 先同時取得資訊 1.新增一張訂單 2.取得購物車中打勾的物品
      const [orderInstance, purchaseItems] = await Promise.all([
        Order.create({ userId }, { transaction }), // create 只會回傳實例，無法用raw: true取得簡單js對象
        CartItem.findAll({ where: { userId, checked: true }, transaction })
      ])
      const order = orderInstance.get({ plain: true }) // 用 get 方法取得簡單js對象
      const rawPurchaseItems = purchaseItems.map(item => item.get({ plain: true }))

      // 同時 1. 在該訂單上新增訂購物品
      const createOrderItems = Promise.all(Array.from(
        rawPurchaseItems,
        (e, _) => OrderItem.create({ orderId: order.id, productId: e.productId }, { transaction })
      ))

      // 同時 2. 移除購物車中打勾的物品
      const removeCheckedItems = Promise.all(Array.from(
        purchaseItems,
        (e, _) => e.destroy({ transaction })
      ))

      // 同時 3. 更新商品資訊的庫存數量
      const updateProductStock = Promise.all(Array.from(
        productInfoList,
        (productInfo, _) => {
          const orderedProduct = orderedProducts.find(p => p.productId === productInfo.id)
          const stock = productInfo.stock - orderedProduct.quantity
          return Product.update({ stock }, { where: { id: productInfo.id }, transaction })
        })
      )

      // 同時做上面3件事
      await Promise.all([createOrderItems, removeCheckedItems, updateProductStock])

      // 如果一切正常，提交交易
      await transaction.commit()

      // 回傳交易成功訊息
      return res.json({ status: 'success', message: 'Transaction successful.' })
    } catch (err) {
      // 如果有任何錯誤發生，回滾交易
      await transaction.rollback()
      next(err)
    }
  }
}

module.exports = orderController
