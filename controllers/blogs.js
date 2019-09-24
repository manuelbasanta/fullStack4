const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

blogsRouter.get('/', async (request, response, next) => {
    try {
		const blogs = await Blog.find({})
			.populate('user', {username: 1, name: 1, id: 1})
		response.json(blogs)
    } catch (error){
		next(error)
    }
})

blogsRouter.get('/:id', async (request, response, next) => {

	try {
		const blog = await Blog.findById(request.params.id)
		if (blog) {
			response.status(200).json(blog.toJSON())
		} else {
			response.status(404).end() 
		}

	} catch (error) {
		next(error)
	}
})

blogsRouter.delete('/:id', async (request, response, next) => {
	const token = request.token

	try { 

		const decodedToken = jwt.verify(token, process.env.SECRET)
		if (!token || !decodedToken.id) {
		  	return response.status(401).json({ error: 'token missing or invalid' })
		}

		const blog = await Blog.findById(request.params.id)
		if (!blog) {
			return response.status(404).end() 
		} 

		if(blog.user.toString() === decodedToken.id.toString()) {
			await Blog.findByIdAndRemove(request.params.id)
			response.status(204).end();
		} else {
			return response.status(403).json({ error: 'invalid user' })
		}

	} catch(exception) {
		next(exception)
	}

})

// Adding newblog
blogsRouter.post('/', async (request, response, next) => {

	const token = request.token
	const body = request.body

	try {

		const decodedToken = jwt.verify(token, process.env.SECRET)
		if (!token || !decodedToken.id) {
		  	return response.status(401).json({ error: 'token missing or invalid' })
		}


		const user = await User.findById(decodedToken.id)

		const blog = new Blog({
			...body,
			user: user._id
		})


		const savedBlog = await blog.save()
		user.blogs = user.blogs.concat(savedBlog._id)
		await user.save()
		response.status(201).json(savedBlog.toJSON())

	} catch (error) {
		next(error)
	}

})

blogsRouter.put('/:id', async (request, response, next) => {
	const body = request.body;

	const blog = {
		...body
	}

	try {
		const changedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, {new:true})
		response.json(changedBlog.toJSON());
	} catch (error) {
		next(error)
	}

})


module.exports = blogsRouter