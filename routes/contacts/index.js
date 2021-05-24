const express = require('express')
const router = express.Router()
const { getAllContacts, getByIdContact, createContact, updateContact, deleteContact, updateStatus } = require('../../controllers/contacts')
const { validationQueryContact, validateObjectId, validationCreateContact, validateUpdateContact, validateUpdateStatusContact } = require('./valid-contact-router')
const guard = require('../../helper/guard')

router
  .get('/', guard, validationQueryContact, getAllContacts)
  .post('/', guard, validationCreateContact, createContact)

router
  .get('/:id', guard, validateObjectId, getByIdContact)
  .put('/:id', guard, validateUpdateContact, updateContact)
  .delete('/:id', guard, deleteContact)

router
  .patch('/:id/favorite', guard, validateUpdateStatusContact, updateStatus)

module.exports = router
