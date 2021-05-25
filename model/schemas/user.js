const mongoose = require('mongoose')
const { Schema, model, SchemaTypes } = mongoose
const gravatar = require('gravatar')
const { Gender } = require('../../helper/constants')
const bcrypt = require('bcryptjs')
const { nanoid } = require('nanoid')
const SALT_FACTOR = 6

const userSchema = new Schema({
  name: {
    type: String,
    minlenhth: 2,
    default: 'Guest'
  },
  gender: {
    type: String,
    enum: {
      values: [Gender.MALE, Gender.FEMALE, Gender.NONE],
      message: "It's  not allowed"
    },
    default: Gender.NONE
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    // validate(value) {
    //   const re = /\S+@\S+\.\S+/
    //   return re.test(String(value).toLowerCase())
    // }
  },
  subscription: {
    type: String,
    enum: ['starter', 'pro', 'business'],
    default: 'starter'
  },
  token: {
    type: String,
    default: null,
  },
  avatar: {
    type: String,
    default: function () {
      return gravatar.url(this.email, { s: '250', d: 'identicon' }, true)
    }
  },
  owner: {
    type: SchemaTypes.ObjectId,
    ref: 'user',
  },
  verify: {
    type: Boolean,
    default: false,
  },
  verifyToken: {
    type: String,
    required: [true, 'Verify token is required'],
    default: nanoid()
  },
},
{
  versionKey: false,
  timestamps: true,
}
)

userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt(SALT_FACTOR)
    this.password = await bcrypt.hash(this.password, salt)
  }
  next()
})

userSchema.methods.validPassword = async function(password) {
  return await bcrypt.compare(String(password), this.password)
}
const User = model('user', userSchema)

module.exports = User
