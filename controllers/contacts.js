const Contacts = require('../model/index')

const getAllContacts = async (req, res, next) => {
  try {
    const userId = req.user?.id
    const { contacts, total, limit, offset, page } = await Contacts.listContacts(userId, req.query)
    return res.json({
      status: 'success',
      code: 200,
      data: {
        contacts, total, limit, offset, page
      }
    })
  } catch (e) {
    next(e)
  }
}

const getByIdContact = async (req, res, next) => {
  const userId = req.user?.id
  try {
    const contact = await Contacts.getContactById(userId, req.params.id)
    console.log(req.params)
    if (contact) {
      return res.json({
        status: 'success',
        code: 200,
        data: {
          contact,
        },
      })
    } else {
      return res.status(404).json({
        status: 'error',
        code: 404,
        data: { message: 'Not found' }
      })
    }
  } catch (e) {
    next(e)
  }
}

const createContact = async (req, res, next) => {
  try {
    const userId = req.user?.id
    const contact = await Contacts.addContact(userId, req.body)
    return res.status(201).json({
      status: 'success',
      code: 201,
      data: {
        contact,
      },
    })
  } catch (e) {
    next(e)
  }
}

const updateContact = async (req, res, next) => {
  try {
    const userId = req.user?.id
    const contact = await Contacts.updateContact(userId, req.params.id, req.body)
    console.log(req.params)
    if (contact) {
      return res.json({
        status: 'success',
        code: 200,
        data: {
          contact,
        },
      })
    } else {
      return res.status(404).json({
        status: 'error',
        code: 404,
        data: { message: 'Not Found' }
      })
    }
  } catch (e) {
    next(e)
  }
}

const deleteContact = async (req, res, next) => {
  try {
    const userId = req.user?.id
    const contact = await Contacts.removeContact(userId, req.params.id)
    if (contact) {
      return res.json({
        status: 'success',
        code: 200,
        data: {
          contact,
        },
      })
    } else {
      return res.status(404).json({
        status: 'error',
        code: 404,
        data: { message: 'Not Found' }
      })
    }
  } catch (e) {
    next(e)
  }
}

const updateStatus = async (req, res, next) => {
  try {
    const userId = req.user?.id
    const contact = await Contacts.updateContact(userId, req.params.id, req.body)
    console.log(req.params)
    if (contact) {
      return res.json({
        status: 'success',
        code: 200,
        data: {
          contact,
        },
      })
    } else {
      return res.status(404).json({
        status: 'error',
        code: 404,
        data: { message: 'Not Found' }
      })
    }
  } catch (e) {
    next(e)
  }
}

module.exports = {
  getAllContacts,
  getByIdContact,
  createContact,
  updateContact,
  deleteContact,
  updateStatus
}
