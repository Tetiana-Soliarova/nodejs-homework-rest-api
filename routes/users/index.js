const express = require('express')
const router = express.Router()
const { signup, login, logout, current } = require('../../controllers/users')
const guard = require('../../helper/guard')
// const { validationCreateContact, validateUpdateContact, validateUpdateStatusContact } = require('./valid-contact-router')

router.post('/signup', signup)
router.post('/login', login)
router.post('/logout', guard, logout)
router.get('/current', guard, current)

module.exports = router
