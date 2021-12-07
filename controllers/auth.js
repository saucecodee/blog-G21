const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const User = require("./../models/user")
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY

const auth = {}

auth.signup = async (req, res) => {
  const data = req.body

  try {
    const passwordHash = await bcrypt.hash(data.password, 10)
    const user = await new User({
      email: data.email,
      password: passwordHash,
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

}

auth.signin = async (req, res) => {
  const data = req.body

  try {
    const user = await User.findOne({ email: data.email })
    if (!user) return res.status(400).send({ message: "Invalid email or password" })
    const isValidPassword = await bcrypt.compare(data.password, user.password)
    if (!isValidPassword) return res.status(400).send({ message: "Invalid email or password" })

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

}

module.exports = auth