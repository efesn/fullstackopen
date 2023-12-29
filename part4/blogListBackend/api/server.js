const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
require('dotenv').config();
const jwt = require('jsonwebtoken')
const User = require('./models/user')

const app = express();

app.use(express.json());
app.use(cors());




mongoose.connect("process.env.MONGODB_URI", {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("Connected to DB")).catch
(console.error);

const Blog = require('./models/blogListModel');

app.get('/api/blogs', (request, response) => {
  const blogs = Blog
    .find({}).populate('user', { username: 1, name: 1 })
      Blog
      .find({})
      .then(blogs => {
        response.json(blogs)
      })
  })

  const getTokenFrom = request => {
    const authorization = request.get('authorization')
    if (authorization && authorization.startsWith('Bearer ')) {
      return authorization.replace('Bearer ', '')
    }
    return null
  }
  
  app.post('/api/blogs/new', (request, response) => {
    const { title, author, url, likes } = request.body;
    const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET)
    if (!decodedToken.id) {
      return response.status(401).json({ error: 'token invalid' })
    }
    const user = User.findById(decodedToken.id)
  
    const blog = new Blog({
      title,
      author,
      url,
      likes,
      user: user.id
    });
  
    blog.save()
      .then(result => {
        response.status(201).json(result);
      })
      .catch(error => {
        response.status(500).json({ error: error.message });
      });
  });


  app.put('/api/blogs/update/:id', async (req, res) => {
    const { title, author, url, likes } = req.body;
    const { id } = req.params;
  
    try {
      const updatedBlog = await Blog.findByIdAndUpdate(
        id,
        { title, author, url, likes },
        { new: true }
      );
      res.json(updatedBlog);
    } catch (error) {
      console.error('Error updating blog:', error);
      res.status(500).json({ error: 'Failed to update blog' });
    }
  });
  
  




app.delete('/api/blogs/delete/:id', async (req, res) => {
    const result = await Blog.findByIdAndDelete(req.params.id);

    res.json(result);
})

app.listen(3001, () => console.log("Server started on port 3001"));

app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)

