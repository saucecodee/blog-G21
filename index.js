const express = require('express');
const morgan = require('morgan');
const app = express();
const port = process.env.PORT || 3030;
const JWT_SECRET_KEY = "fdbiudvu984893cndsioboidsbUIDsbodisbiudjs"

const User = require("./models/user")
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
        email: user.email,
        full_name: user.full_name
      }
    })
  } catch (error) {
    console.log(error)
    res.status(400).send({ message: "User couldn't be created", data: error })
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
        email: user.email,
        full_name: user.full_name
      }
    })
  } catch (error) {
    console.log(error)
    res.status(400).send({ message: "Unable to signin", data: error })
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
