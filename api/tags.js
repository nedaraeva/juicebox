const express = require('express');
const tagsRouter = express.Router();
const { getAllTags, getPostsByTagName } = require('../db');

tagsRouter.use((req, res, next) => {
  console.log("A request is being made to /tags");

  next();
});

tagsRouter.get('/', async (req, res) => {
  const tags = await getAllTags();

  res.send({
    "tags": tags
  });
});

tagsRouter.get('/:tagName/posts', async (req, res, next) => {
  const { tagName } = req.params;
  try {
    const allPostTags = await getPostsByTagName(tagName);

    const postTags = allPostTags.filter(post => {
      if (post.active || (req.user && post.author.id === req.user.id)) {
        return true;
      }
      return false;
    });
    res.send({ posts: postTags });
  } catch ({ name, message }) {
    next({ name, message });
  }
});

module.exports = tagsRouter;