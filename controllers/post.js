const Post = require("./../models/post")

const post = {}

post.create= async (req, res) => {
  const data = req.body

  try {
    const post = await new Post({
      title: data.title,
      body: data.body,
      user_id: req.USER_ID
    }).save()

    res.status(200).send({ message: "Post created", data: post })
  } catch (error) {
    res.status(400).send({ message: "Post wasn't created", error })
  }

}

post.getOne = async (req, res) => {
  try {
    const post = await Post.findById(req.params.post_id).populate("user_id", "email full_name")
    res.status(200).send({ message: "Post", data: post })
  } catch (error) {
    res.status(400).send({ message: "Couldn't get post", error })
  }
}

post.getAll = async (req, res) => {
  try {
    const posts = await Post.find().populate("user_id", "email full_name")
    res.status(200).send({ message: "All posts", data: posts })
  } catch (error) {
    res.status(400).send({ message: "Couldn't get posts", error })
  }
}

post.update = async (req, res) => {
  const data = req.body

  try {
    const post = await Post.findOne({ _id: req.params.post_id })
    if (post.user_id != req.USER_ID) return res.status(403).send({ message: "You can't edit this post" })
    if (!post) return res.status(400).send({ message: "Post wasn't updated" })

    // const newPost = Post.findByIdAndUpdate(req.params.post_id, data) // full update
    const newPost = await Post.findByIdAndUpdate(
      req.params.post_id,
      {
        $set: {
          title: data.title,
          body: data.body
        }
      },
      { new: true }
    ) // partial update

    res.status(200).send({ message: "Post updated", data: newPost })
  } catch (error) {
    console.log(error)
    res.status(400).send({ message: "Post wasn't updated", error })
  }

}

post.delete = async (req, res) => {
  try {
    const post = await Post.findOne({ _id: req.params.post_id })
    if (post.user_id != req.USER_ID) return res.status(403).send({ message: "You can't delete this post" })
    await Post.findByIdAndDelete(req.params.post_id)
    res.status(200).send({ message: "Post deleted", data: post })
  } catch (error) {
    res.status(400).send({ message: "Couldn't delete post", error })
  }
}


module.exports = post