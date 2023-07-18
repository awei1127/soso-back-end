const express = require('express')
const router = express.Router()
const passport = require('passport')
const authenticated = require('../middleware/auth')
const userController = require('../controllers/user-controller')
const cartController = require('../controllers/cart-controller')
// const { errorHandler } = require('../middleware/error-handler')
// const upload = require('../middleware/multer')

router.post('/api/v1/signin', passport.authenticate('local', { session: false }), userController.signIn)
router.post('/api/v1/signup', userController.signUp)
router.get('/api/v1/cart/:userId', authenticated, cartController.getCartItems)

module.exports = router
