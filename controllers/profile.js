const User = require("./../models/user")

const profile = {}


profile.edit = async (req, res) => {
  const data = req.body
  const user_id = req.USER_ID
  try {
    const profile = await User.findById(user_id)
    if (!profile) return res.status(400).send({ message: "User profile does not exist" })
    const newProfile = await User.findByIdAndUpdate(
      user_id,
      { $set: { full_name: data.full_name } },
      { new: true }
    )
    res.status(200).send({ message: "Updated user profile", data: newProfile })
  } catch (error) {
    res.status(400).send({ message: "Couldn't edit profile", error })
  }
}

profile.view = async (req, res) => {
  try {
    const profile = await User.findById(req.params.user_id).select("-password -__v")
    res.status(200).send({ message: "User profile", data: profile })
  } catch (error) {
    res.status(400).send({ message: "Couldn't get profile", error })
  }
}

profile.delete = async (req, res) => {
  try {
    const profile = await User.findByIdAndDelete(req.USER_ID)
    res.status(200).send({ message: "User profile deleted", data: profile })
  } catch (error) {
    res.status(400).send({ message: "Couldn't delete profile", error })
  }
}


module.exports = profile