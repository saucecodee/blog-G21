const express = require('express');
const morgan = require('morgan');
require('dotenv').config()
const app = express();
const port = process.env.PORT;

app.use(morgan('dev'));
app.use(express.json())
app.use(express.urlencoded({ extended: false }));


// Setup MongoDB config
const mongoose = require('mongoose');
const MONGODB_URI = process.env.MONGODB_URI

app.get('/ping', (req, res) => {
  res.status(200).send("Hello world!")
});
app.use("/auth", require("./routes/auth"))
app.use("/post", require("./routes/post"))
app.use("/profile", require("./routes/profile"))


app.use("**", (req, res) => {
  res.status(404).send({ message: "Route not found" })
})

app.use((error, req, res, next) => {
  console.log(error)
  res.status(500).send({ message: "Something went wrong", error: error.message })
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