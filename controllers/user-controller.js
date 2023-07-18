const jwt = require('jsonwebtoken')
const { User } = require('../models')
const bcrypt = require('bcryptjs')

const userController = {
  signIn: (req, res, next) => {
    // 拿著已驗證的驗證資訊，用jwt套件來做token並且用res.json來把token跟user回傳 (在呼叫這個方法前需要通過中間件的驗證並把已驗證的user放在req.user)
    try {
      const userData = req.user.toJSON()
      delete userData.password
      const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '30d' })
      res.json({
        status: 'success',
        data: {
          token,
          user: userData
        }
      })
    } catch (err) {
      next(err)
    }
  },
  signUp: async (req, res, next) => {
    const { name, email, password, passwordCheck } = req.body
    // 如果有空欄，回傳錯誤訊息
    if (!name || !email || !password || !passwordCheck) {
      return res.json({ status: 'failure', message: 'All fields are required.' })
    }
    // 如果密碼不同，回傳錯誤訊息
    if (password !== passwordCheck) {
      return res.json({ status: 'failure', message: 'Passwords do not match.' })
    }
    try {
      const user = await User.findOne({ where: { email } })
      // 如果email已存在，回傳錯誤訊息
      if (user) {
        return res.json({ status: 'failure', message: 'Email already exists.' })
      }
      const hash = await bcrypt.hash(req.body.password, 10)
      const createdUser = await User.create({ name, email, password: hash })
      const userData = createdUser.toJSON()
      delete userData.password
      res.json({
        status: 'success',
        data: { user: userData }
      })
    } catch (err) {
      next(err)
    }
  }
}

module.exports = userController
