const express = require("express");
const router = express.Router();

const { jwtDecoder, checkToken } = require("../utils");

const {
  createPost,
  findPostByUser,
  findPostByPostId,
  deletePostByPostId,
} = require("../queries");

///////////////////////////////////////////////////////
//
// -*-*- POSTS MANAGEMENT ROUTER -*-*-
//
///////////////////////////////////////////////////////

router.post("/post", checkToken, async (req, res) => {
  const post = req.body.post;

  const decodedToken = jwtDecoder(req.headers.authorization);

  const newPost = createPost(post, decodedToken.id);

  if (!newPost) {
    return res.status(404).json({ msg: "Could post the message" });
  }

  return res.status(201).json({ msg: "Posted correctly" });
});

router.get("/posts/:userId", checkToken, async (req, res) => {
  const userId = req.params.userId;

  const post = await findPostByUser(userId);

  if (!post) {
    return res.status(404).json({ msg: "Not posts found for this user" });
  }

  return res.status(200).json({ post });
});

router.delete("/post/:postId", checkToken, async (req, res) => {
  const postId = req.params.postId;
  const decodedToken = jwtDecoder(req.headers.authorization);
  const userId = decodedToken.id;

  const post = await findPostByPostId(postId);

  if (!post) {
    return res.status(404).json({ msg: "Not posts found for this user" });
  }

  if (userId !== post[0].user) {
    return res.status(403).json({ msg: "Permision denied!" });
  }

  try {
    await deletePostByPostId(postID);
    return res.status(200).json({ msg: "Post deleted!" });
  } catch (error) {
    return res.status(500).json({ msg: "Couldn't delete the post requested" });
  }
});

///////////////////////////////////////////////////////

module.exports = router;
