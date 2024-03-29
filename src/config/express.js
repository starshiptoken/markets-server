const express = require('express')
const morgan = require('morgan')
const compress = require('compression')
const methodOverride = require('method-override')
const cors = require('cors')
const helmet = require('helmet')
const errors = require('./middlewares/error')
const routes = require('./routes')
const admin = require('./admin')

// create an express application
const app = express()

// request logging. dev: console | production: file
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'))

// mount admin routes
app.use('/admin', admin)

// parse body params and attache them to req.body
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// gzip compression
app.use(compress())

// lets you use HTTP verbs such as PUT or DELETE
// in places where the client doesn't support it
app.use(methodOverride())

// secure apps by setting various HTTP headers
app.use(helmet())

// enable CORS - Cross Origin Resource Sharing
app.use(cors())

// mount API v1 routes
app.use('/v1', routes)

// if error is not an instanceOf APIError, convert it.
app.use(errors.converter)

// catch 404 and forward to error handler
app.use(errors.notFound)

// error handler, send stacktrace only during development
app.use(errors.handler)

module.exports = app
