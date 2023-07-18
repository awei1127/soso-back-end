const passport = require('passport')
const LocalStrategy = require('passport-local')
const passportJWT = require('passport-jwt')
const JWTStrategy = passportJWT.Strategy
const ExtractJWT = passportJWT.ExtractJwt

const bcrypt = require('bcryptjs')
const { User } = require('../models')

// set up Passport strategy
passport.use(new LocalStrategy(
  // customize user field
  {
    usernameField: 'email',
    passwordField: 'password'
  },
  // authenticate user
  async (email, password, done) => {
    try {
      const user = await User.findOne({ where: { email } })
      if (!user) return done(null, false)

      const match = await bcrypt.compare(password, user.password)
      if (!match) return done(null, false)

      return done(null, user)
    } catch (err) {
      done(err)
    }
  }
))

// 當request帶著token來的時候，用來驗證token的方法。
passport.use(new JWTStrategy(
  // customize user field
  {
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET
  },
  // authenticate user
  async (jwtPayload, done) => {
    try {
      const user = await User.findByPk(jwtPayload.id)
      return done(null, user)
    } catch (err) {
      done(err)
    }
  }
))

module.exports = passport
