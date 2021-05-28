const jwt = require('jsonwebtoken')
const jimp = require('jimp')
const fs = require('fs/promises')
const path = require('path')
require('dotenv').config()

const Users = require('../model/users')
const { HttpCode } = require('../helper/constants')
const EmailService = require('../services/email')
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY

const signup = async (req, res, next) => {
  const user = await Users.findByEmail(req.body.email)
  if (user) {
    return res.status(HttpCode.CONFLICT).json({
      status: 'error',
      code: HttpCode.CONFLICT,
      message: 'Email is  use',
    })
  }
  try {
    const newUser = await Users.create(req.body)
    const { id, name, email, gender, avatar, verifyToken } = newUser
    try {
      const emailService = new EmailService(process.env.NODE_ENV)
      await emailService.sendVerifyEmail(verifyToken, email, name
      )
    } catch (e) {
    // logger
      console.log(e.message)
    }
    return res.status(HttpCode.CREATED).json({
      status: 'success',
      code: HttpCode.CREATED,
      data: {
        id,
        email,
        gender,
        avatar,
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
  if (!user.verify) {
    return res.status(HttpCode.UNAUTHORIZED).json({
      status: 'error',
      code: HttpCode.UNAUTHORIZED,
      message: 'The user is not verificated',
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

const verify = async (req, res, next) => {
  // console.log('Происходит варификация')
  try {
  //  console.log('Hy', req.params)
    const user = await Users.findByVerificationTokenEmail(req.params.token)
   // console.log('Hy', req.params)
   // console.log('Hy', user)
    if (user) {
      await Users.updateTokenVerify(user.id, true, null)
      console.log('Hy', user)
      return res.status(HttpCode.OK).json({
        status: 'success',
        code: HttpCode.OK,
        data: { message: 'Verification successful' },
      })
    }
    return res.status(HttpCode.NOT_FOUND).json({
      status: 'error',
      code: HttpCode.NOT_FOUND,
      data: { message: 'User not found' },
    })
  } catch (error) {
    next(error)
  }
}

const repeatEmailVerify = async (req, res, next) => {
  try {
    const user = await Users.findByEmail(req.body.email)
    if (user) {
      const { name, verifyToken, email } = user
      const emailService = new EmailService(process.env.NODE_ENV)
      await emailService.sendVerifyEmail(verifyToken, email, name
      )
      return res.status(HttpCode.OK).json({
        status: 'success',
        code: HttpCode.OK,
        data: { message: 'Verification email sent' },
      })
    }
    if (user.verify) {
      return res.status(HttpCode.BAD_REQUEST).json({
        status: 'success',
        code: HttpCode.BAD_REQUEST,
        data: { message: 'Verification has already been passed' },
      })
    }
    return res.status(HttpCode.BAD_REQUEST).json({
      status: 'error',
      code: HttpCode.BAD_REQUEST,
      data: { message: 'Missing required field email or invalid email' },
    })
  } catch (error) {
    next(error)
  }
}
module.exports = {
  signup,
  login,
  logout,
  current,
  updateAvatar,
  verify,
  repeatEmailVerify
}
