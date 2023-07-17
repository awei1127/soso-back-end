const express = require('express')
const router = express.Router()
const passport = require('passport')

const userController = require('../controllers/user-controller')

// const { authenticator } = require('../middleware/auth')
// const { errorHandler } = require('../middleware/error-handler')
// const upload = require('../middleware/multer')

router.post('/api/v1/signin', passport.authenticate('local', { session: false }), userController.signIn)

module.exports = router
