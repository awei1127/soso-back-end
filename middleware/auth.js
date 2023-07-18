const passport = require('../config/passport')

const authenticated = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, data) => {
    if (err || !data) return res.status(401).json({ status: 'failure', message: 'Unauthorized.' })
    req.user = data
    return next()
  })(req, res, next)
}

module.exports = authenticated
