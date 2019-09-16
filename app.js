const config = require('./utils/config')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const cors = require('cors')
const express = require('express')
const app = express()
const blogsRouter = require('./controllers/blogs');
const middleware = require('./utils/middleware')

console.log('connecting to', config.MONGODB_URI);

mongoose.connect(config.MONGODB_URI, { useNewUrlParser: true })
    .then( () => {
        console.log('connected to MongoDB')
    })
    .catch( (error) => {
        console.log('error connecting to MongoDB:', error.message)
    })

app.use(cors())
app.use(bodyParser.json())
app.use(middleware.requestLogger)
app.use('/api/blogs' , blogsRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app