if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const express = require('express')
const app = express()
const expressLayouts = require('express-ejs-layouts')
const mongoose = require('mongoose')
const methodOverride = require('method-override')
const morgan = require('morgan')
const fs = require('fs')

// Routers
const indexRouter = require('./routes/index')
const customerRouter = require('./routes/customers')

app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
app.set('layout', 'layouts/layout')
app.use(expressLayouts)
app.use(methodOverride('_method'))
app.use(express.static('public'))
app.use(express.urlencoded({ extended: false }))

// Measure end-to-end latency
const format = (tokens, req, res) => {
    if (tokens.url(req, res).startsWith('/customers')) {
        return [
            'End-to-end latency: ',
            tokens['response-time'](req, res), 'ms',
            // '-',
            tokens.status(req, res),
            tokens.method(req, res),
            tokens.url(req, res)
        ].join(' ')
    }
}
app.use(morgan(format, { stream: fs.createWriteStream('./logs/endtoend.log', { flags: 'a' }) }))

// Database connection
mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
})
const db = mongoose.connection
db.on('error', error => console.error('❌ Mongoose DB connection\n', error))
db.on('open', () => console.log('✅ Mongoose DB connection'))

// Routes
app.use('/', indexRouter)
app.use('/customers', customerRouter)

// Error handling
app.use((err, req, res, next) => {
    res.status(err.status || 500)
    res.json({ error: `${err}` })
})

// Server
app.listen(process.env.PORT, () => console.log(`✅ Server running [👂:${process.env.PORT}]`))
