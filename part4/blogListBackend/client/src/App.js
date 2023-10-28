import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './index.css';

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [blogData, setBlogData] = useState({ title: '', author: '', url: '', likes: 0 });
  const [showPopup, setShowPopup] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [deletionOccurred, setDeletionOccurred] = useState(false);
  const [updateData, setUpdateData] = useState({ title: '', author: '', url: '', likes: 0 });
  const [selectedBlog, setSelectedBlog] = useState(null);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/blogs');
      setBlogs(response.data);
    } catch (error) {
      console.error('Error fetching blogs:', error);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setBlogData({ ...blogData, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:3001/api/blogs/new', blogData);
      console.log('Blog added successfully:', response.data);
      setBlogData({ title: '', author: '', url: '', likes: 0 });
      fetchBlogs();
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 2000);
    } catch (error) {
      console.error('Error adding blog:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`http://localhost:3001/api/blogs/delete/${id}`);
      console.log('Blog deleted successfully:', response.data);
      setBlogs((prevBlogs) => prevBlogs.filter((blog) => blog._id.toString() !== id));
      setDeletionOccurred(true);
      setTimeout(() => {
        setDeletionOccurred(false);
        setPopupMessage('Your Blog is deleted');
        setShowPopup(true);
      }, 500);
    } catch (error) {
      console.error('Error deleting blog:', error);
    }
  };

  const handleEdit = (blog) => {
    setSelectedBlog(blog);
    setUpdateData({
      title: blog.title,
      author: blog.author,
      url: blog.url,
      likes: blog.likes,
    });
  };

  const handleUpdate = async () => {
    const { _id } = selectedBlog;
    try {
      const response = await axios.put(`http://localhost:3001/api/blogs/update/${_id}`, updateData);
      console.log('Blog updated successfully:', response.data);
      fetchBlogs();
      setSelectedBlog(null);
      setUpdateData({ title: '', author: '', url: '', likes: 0 });
    } catch (error) {
      console.error('Error updating blog:', error);
    }
  };

  const renderBlogs = () => {
    return blogs.map((blog) => (
      <div className="blog-item" key={blog._id}>
        <h3>{blog.title}</h3>
        <p>Author: {blog.author}</p>
        <p>URL: <a href={blog.url}>{blog.url}</a></p>
        <p>Likes: {blog.likes}</p>
        <div className="button-container">
          <button onClick={() => handleEdit(blog)} className="edit-button">Edit</button>
          <button onClick={() => handleDelete(blog._id)} className="delete-button">Delete</button>
        </div>
      </div>
    ));
  };

  return (
    <div className="container">
      {showPopup && <div className="popup">{popupMessage}</div>}
      {deletionOccurred && <div className="popup">Your Blog is deleted</div>}
      <div className="add-blog-form">
        <h2>Blog List App</h2>
        <h4>Add a Blog:</h4>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="title"
            placeholder="Title"
            value={blogData.title}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="author"
            placeholder="Author"
            value={blogData.author}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="url"
            placeholder="URL"
            value={blogData.url}
            onChange={handleInputChange}
          />
          <input
            type="number"
            name="likes"
            placeholder="Likes"
            value={blogData.likes}
            onChange={handleInputChange}
          />
          <button type="submit">Add Blog</button>
        </form>
        <h1>Your List:</h1>
        <div className="blog-list">
          {renderBlogs()}
        </div>
      </div>
      {selectedBlog && (
        <div className="update-form">
          <h4>Update Blog:</h4>
          <form>
            <input
              type="text"
              name="title"
              placeholder="Title"
              value={updateData.title}
              onChange={(e) => setUpdateData({ ...updateData, title: e.target.value })}
            />
            <input
              type="text"
              name="author"
              placeholder="Author"
              value={updateData.author}
              onChange={(e) => setUpdateData({ ...updateData, author: e.target.value })}
            />
            <input
              type="text"
              name="url"
              placeholder="URL"
              value={updateData.url}
              onChange={(e) => setUpdateData({ ...updateData, url: e.target.value })}
            />
            <input
              type="number"
              name="likes"
              placeholder="Likes"
              value={updateData.likes}
              onChange={(e) => setUpdateData({ ...updateData, likes: e.target.value })}
            />
            <button type="button" onClick={handleUpdate}>Update</button>
            <button type="button" onClick={() => setSelectedBlog(null)}>Cancel</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default App;
