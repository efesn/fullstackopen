const dummy = (blogs) => {
    return 1;
  };
  
  const totalLikes = (blogs) => {
    const likes = blogs.map((blog) => blog.likes);
    const sum = likes.reduce((total, current) => total + current, 0);
    return sum;
  };
  
  const favoriteBlog = (blogs) => {
    if (blogs.length === 0) {
      return null;
    }
    const maxLikes = Math.max(...blogs.map((blog) => blog.likes));
    const favorite = blogs.find((blog) => blog.likes === maxLikes);
    return {
      title: favorite.title,
      author: favorite.author,
      likes: favorite.likes,
    };
  };
  
  const mostBlogs = (blogs) => {
    if (blogs.length === 0) {
      return null;
    }
    const blogCount = blogs.reduce((count, blog) => {
      count[blog.author] = (count[blog.author] || 0) + 1;
      return count;
    }, {});
    const authorWithMostBlogs = Object.keys(blogCount).reduce((a, b) =>
      blogCount[a] > blogCount[b] ? a : b
    );
    return {
      author: authorWithMostBlogs,
      blogs: blogCount[authorWithMostBlogs],
    };
  };
  
  const mostLikes = (blogs) => {
    if (blogs.length === 0) {
      return null;
    }
    const likeCount = blogs.reduce((count, blog) => {
      count[blog.author] = (count[blog.author] || 0) + blog.likes;
      return count;
    }, {});
    const authorWithMostLikes = Object.keys(likeCount).reduce((a, b) =>
      likeCount[a] > likeCount[b] ? a : b
    );
    return {
      author: authorWithMostLikes,
      likes: likeCount[authorWithMostLikes],
    };
  };
  
  module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes,
  };
  