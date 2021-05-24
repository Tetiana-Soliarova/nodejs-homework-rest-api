const express = require('express')
const router = express.Router()
const { signup, login, logout, current, updateAvatar } = require('../../controllers/users')
const guard = require('../../helper/guard')
const uploadAvatar = require('../../helper/upload-avatar')
// const { validationCreateContact, validateUpdateContact, validateUpdateStatusContact } = require('./valid-contact-router')

router.post('/signup', signup)
router.post('/login', login)
router.post('/logout', guard, logout)
router.get('/current', guard, current)

router.patch('/avatars', guard, uploadAvatar.single('avatar'), updateAvatar)

module.exports = router
