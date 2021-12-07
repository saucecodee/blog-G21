const express = require('express');
const morgan = require('morgan');
const app = express();
const port = process.env.PORT || 3030;
const JWT_SECRET_KEY = "fdbiudvu984893cndsioboidsbUIDsbodisbiudjs"

const User = require("./models/user")
const Post = require("./models/post")
const jwt = require("jsonwebtoken")

app.use(morgan('dev'));
app.use(express.json())
app.use(express.urlencoded({ extended: false }));


// Setup MongoDB config
const mongoose = require('mongoose');
const MONGODB_URI = "mongodb://localhost:27017/blog"

app.get('/ping', (req, res) => {
  res.status(200).send("Hello world!")
});

app.post("/auth/signup", async (req, res) => {
  const data = req.body

  try {
    const user = await new User({
      email: data.email,
      password: data.password,
      full_name: data.full_name
    }).save()

    const token = jwt.sign({ user_id: user._id }, JWT_SECRET_KEY, { expiresIn: 60 * 10 })

    res.status(201).send({
      message: "User created",
      data: {
        token,
        user_id: user._id,
        email: user.email,
        full_name: user.full_name
      }
    })
  } catch (error) {
    res.status(400).send({ message: "User couldn't be created", error })
  }

})

app.post("/auth/signin", async (req, res) => {
  const data = req.body


  try {
    const user = await User.findOne({ email: data.email })
    if (!user) return res.status(400).send({ message: "Invalid email or password" })
    if (data.password != user.password) return res.status(400).send({ message: "Invalid email or password" })

    const token = jwt.sign({ user_id: user._id }, JWT_SECRET_KEY)

    res.status(200).send({
      message: "User created",
      data: {
        token,
        user_id: user._id,
        email: user.email,
        full_name: user.full_name
      }
    })
  } catch (error) {
    console.log(error)
    res.status(400).send({ message: "Unable to signin", error })
  }

})

app.post("/post", async (req, res) => {
  const data = req.body

  try {
    const post = await new Post({
      title: data.title,
      body: data.body,
      user_id: data.user_id
    }).save()

    res.status(200).send({ message: "Post created", data: post })
  } catch (error) {
    res.status(400).send({ message: "Post wasn't created", error })
  }

})

app.patch("/post/:post_id", async (req, res) => {
  const data = req.body

  try {
    const post = await Post.findOne({ _id: req.params.post_id })
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

})

app.get("/post", async (req, res) => {
  try {
    const posts = await Post.find().populate("user_id", "email full_name")
    res.status(200).send({ message: "All posts", data: posts })
  } catch (error) {
    res.status(400).send({ message: "Couldn't get posts", error })
  }
})

app.get("/post/:post_id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.post_id).populate("user_id", "email full_name")
    res.status(200).send({ message: "Post", data: post })
  } catch (error) {
    res.status(400).send({ message: "Couldn't get post", error })
  }
})

app.delete("/post/:post_id", async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.post_id)
    res.status(200).send({ message: "Post deleted", data: post })
  } catch (error) {
    res.status(400).send({ message: "Couldn't delete post", error })
  }
})

app.get("/profile/:user_id", async (req, res) => {
  try {
    const profile = await User.findById(req.params.user_id).select("-password -__v")
    res.status(200).send({ message: "User profile", data: profile })
  } catch (error) {
    res.status(400).send({ message: "Couldn't get profile", error })
  }
})

app.patch("/profile/:user_id", async (req, res) => {
  const data = req.body

  try {
    const profile = await User.findById(req.params.user_id)
    if (!profile) return res.status(400).send({ message: "User profile does not exist" })
    const newProfile = await User.findByIdAndUpdate(
      req.params.user_id,
      { $set: { full_name: data.full_name } },
      { new: true }
    )
    res.status(200).send({ message: "Updated user profile", data: newProfile })
  } catch (error) {
    res.status(400).send({ message: "Couldn't edit profile", error })
  }
})

app.delete("/profile/:user_id", async (req, res) => {
  try {
    const profile = await User.findByIdAndDelete(req.params.user_id)
    res.status(200).send({ message: "User profile deleted", data: profile })
  } catch (error) {
    res.status(400).send({ message: "Couldn't delete profile", error })
  }
})

app.listen(port, async () => {
  try {
    await mongoose.connect(MONGODB_URI)
    console.log(':::> Connected to MongoDB database')
  } catch (error) {
    console.log("<::: Couldn't connect to database ", error)
  }

  console.log(`:::> listening on http://localhost:${port}`)
});
