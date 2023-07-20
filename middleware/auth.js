const passport = require('../config/passport')

const authenticated = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, data) => {
    if (err || !data) return res.status(401).json({ status: 'failure', message: 'Unauthorized.' })
    req.user = data
    return next()
  })(req, res, next)
}
const isUser = (req, res, next) => {
  if (req.user.role !== 'user') {
    return res.status(403).json({ status: 'failure', message: 'Permission denied.' })
  }
  return next()
}
const isSeller = (req, res, next) => {
  if (req.user.role !== 'seller') {
    return res.status(403).json({ status: 'failure', message: 'Permission denied.' })
  }
  return next()
}

module.exports = {
  authenticated,
  isUser,
  isSeller
}
