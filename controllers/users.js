const usersRouter = require('express').Router()
const User = require('../models/user')
const bcrypt = require('bcryptjs')

usersRouter.post('/', async (request,response,next) => {
   
    const body = request.body

    if(!body.password || body.password.lenght < 3) {
        next({message:'invalid password', name: 'ValidationError'})
        return
    }
    
    try {
        const saltRounds = 10

        const passwordHash = await bcrypt.hash(body.password, saltRounds)

        const user = new User({
            username: body.username,
            name: body.name,
            passwordHash,
        })

        const savedUser = await user.save()
        response.json(savedUser.toJSON())

    } catch (err) {
        next(err)
    }
})

usersRouter.get('/', async (request,response,next) => {
    try {
        const users = await User.find({})
            .populate('blogs', {url: 1, title: 1, author: 1, id: 1})
        response.json(users.map(user => user.toJSON()))
    } catch (err) {
        next(err)
    }
})

module.exports = usersRouter