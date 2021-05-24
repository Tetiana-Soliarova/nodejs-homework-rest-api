const jwt = require('jsonwebtoken')
const jimp = require('jimp')
const fs = require('fs/promises')
const path = require('path')
require('dotenv').config()
const Users = require('../model/users')
const { HttpCode } = require('../helper/constants')

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY

const signup = async (req, res, next) => {
  const { email } = req.body
  const user = await Users.findByEmail(email)
  if (user) {
    return res.status(HttpCode.CONFLICT).json({
      status: 'error',
      code: HttpCode.CONFLICT,
      message: 'Email is  use',
    })
  }
  try {
    const newUser = await Users.create(req.body)
    return res.status(HttpCode.CREATED).json({
      status: 'success',
      code: HttpCode.CREATED,
      data: {
        id: newUser.id,
        email: newUser.email,
        gender: newUser.gender,
        avatar: newUser.avatar,
      },
    })
  } catch (e) {
    next(e)
  }
}

const login = async (req, res, next) => {
  const { email, password } = req.body
  const user = await Users.findByEmail(email)
  const isValidPassword = await user?.validPassword(password)
  if (!user || !isValidPassword) {
    return res.status(HttpCode.UNAUTHORIZED).json({
      status: 'error',
      code: HttpCode.UNAUTHORIZED,
      message: 'Email or password is wrong',
    })
  }
  const payload = { id: user.id }
  const token = jwt.sign(payload, JWT_SECRET_KEY, { expiresIn: '2h' })
  await Users.updateToken(user.id, token)
  return res.status(HttpCode.OK).json({
    status: 'success',
    code: HttpCode.OK,
    data: { token },
  })
}
const logout = async (req, res, next) => {
  const id = req.user.id
  await Users.updateToken(id, null)
  return res.status(HttpCode.NO_CONTENT).json({})
}

const current = async (req, res, next) => {
  try {
    const tokenToVerify = req.user.token
    const { id } = jwt.verify(tokenToVerify, JWT_SECRET_KEY)
    const { email, subscription } = await Users.findById(id)
    return res.status(HttpCode.OK).json({
      status: 'success',
      code: HttpCode.OK,
      user: {
        id,
        email,
        subscription,
      },
    })
  } catch (e) {
    next(e)
  }
}

const updateAvatar = async (req, res, next) => {
  const { id } = req.user
  const avatarUrl = await saveAvatarUser(req)
  await Users.updateAvatar(id, avatarUrl)
  return res
    .status(HttpCode.OK)
    .json({ status: 'success', code: HttpCode.OK, data: { avatarUrl } })
}

const saveAvatarUser = async (req) => {
  const FOLDER_AVATARS = process.env.FOLDER_AVATARS
  const pathFile = req.file.path

  // console.log('~file: users.js ~line 97 ~ saveAvatarUser ~ pathFile', pathFile,)
  const newNameAvatar = `${Date.now().toString()}-${req.file.originalname}`
  const img = await jimp.read(pathFile)
  await img
    .autocrop()
    .cover(250, 250, jimp.HORIZONTAL_ALIGN_CENTER | jimp.VERTICAL_ALIGN_MIDDLE)
    .writeAsync(pathFile)
  try {
    await fs.rename(
      pathFile,
      path.join(process.cwd(), 'public', FOLDER_AVATARS, newNameAvatar),
    )
  } catch (e) {
    console.log(e.message)
  }
  const oldAvatar = req.user.avatar
  if (oldAvatar.includes(`${FOLDER_AVATARS}/`)) {
    await fs.unlink(path.join(process.cwd(), 'public', oldAvatar))
  }

  return path.join(FOLDER_AVATARS, newNameAvatar).replace('\\', '/') // replace('\\', '/') - заменяем \\ на /
}

module.exports = {
  signup,
  login,
  logout,
  current,
  updateAvatar,
}
