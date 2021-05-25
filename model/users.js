const User = require('./schemas/user')

// поиск по id
const findById = async (id) => {
  return await User.findOne({ _id: id })
}
// поиск по токину
const findByVerificationTokenEmail = async (token) => {
  return await User.findOne({ verifyTokenEmail: token })
}
const findByEmail = async (email) => {
  return await User.findOne({ email })
}

const create = async (userOptions) => {
  const user = new User(userOptions)
  return await user.save()
}

const updateToken = async (id, token) => {
  return await User.updateOne({ _id: id }, { token })
}

const updateAvatar = async (id, avatar) => {
  return await User.updateOne({ _id: id }, { avatar })
}

const updateTokenVerify = async (id, verify, verifyToken) => {
  return await User.updateOne(
    { _id: id },
    { verify, verifyTokenEmail: verifyToken })
}

module.exports = {
  findById,
  findByEmail,
  create,
  updateToken,
  updateAvatar,
  updateTokenVerify,
  findByVerificationTokenEmail
}
