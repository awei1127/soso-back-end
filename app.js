// 如果環境名不是production就引入dotenv
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const express = require('express')
const passport = require('./config/passport')
const routes = require('./routes')
const app = express()
const port = process.env.PORT || 3000

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(passport.initialize())
app.use(routes)

// Listen the server when it started
app.listen(port, () => {
  console.log(`Express is running on http://localhost:${port}`)
})
