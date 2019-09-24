const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)

test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  
})

test('there are 6 blogs', async () => {
    const response = await api.get('/api/blogs')
  
    expect(response.body.length).toBe(6)
})

test('unique identifier property of the blog posts is named id', async () => {
    const response = await api.get('/api/blogs/')

    expect(response.body[0].id).toBeDefined();
});

test('creates a new blog post', async () => {

    const initialBlogs = await api.get('/api/blogs/');

    const newBlog  = {
        title: 'Test blog',
        author: 'String',
        url: 'String',
        likes: 12
    }
  
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)
  
    const blogsAtEnd = await api.get('/api/blogs/');

    expect(blogsAtEnd.body.length).toBe(initialBlogs.body.length + 1)

    const contents = blogsAtEnd.body.map(blog => blog.title)

    expect(contents).toContain(
      'Test blog'
    )
})

test('Blog with no likes in propery defaults to 0', async () => {

    const newBlog  = {
        title: 'Likeless blog',
        author: 'String',
        url: 'String'
    }
  
    const resultBlog = await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    expect(resultBlog.body.likes).toEqual(0)
})

test('title and url properties can not be missing from the request', async () => {

    const blogNoTitle  = {
        author: 'String',
        url: 'String'
    }

    const blogNoUrl  = {
        title: 'HEy',
        author: 'String'
    }
  
    await api
      .post('/api/blogs')
      .send(blogNoTitle)
      .expect(400)

      await api
      .post('/api/blogs')
      .send(blogNoUrl)
      .expect(400)

})

describe('deletion of a blog', () => {
    test('a blog can be deleted', async () => {
        const initialBlogs = await api.get('/api/blogs/');
        const blogToDelete = initialBlogs.body[0]

        await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .expect(204)
    
        const blogsAtEnd = await api.get('/api/blogs/');
    
        expect(blogsAtEnd.body.length).toBe(
            initialBlogs.body.length - 1
        )

    })

})

afterAll(() => {
    mongoose.connection.close()
})