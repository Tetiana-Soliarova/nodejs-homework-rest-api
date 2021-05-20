const Contact = require('./schemas/contact')

const listContacts = async () => {
  const results = await Contact.find()
  return results
}

const getContactById = async (id) => {
  const result = await Contact.findOne({ _id: id })
  return result
}

const removeContact = async (id) => {
  const result = await Contact.findByIdAndRemove({ _id: id })
  return result
}

const addContact = async (body) => {
  try {
    const results = await Contact.create(body)
    return results
  } catch (e) {
    if (e.name === 'ValidationError') {
      e.status = 400
    }
    throw e
  }
}

const updateContact = async (id, body) => {
  const result = await Contact.findByIdAndUpdate(
    { _id: id },
    { ...body },
    { new: true }
  )
  return result
}
/*
const updateStatusContact = async (id, body) => {
  if (Object.keys(body).length !== 0) {
    const result = await Contact.findByIdAndUpdate(
      { _id: id },
      { ...body },
      { new: true })
    return result
  } else {
    return null
  }
}
*/
module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
// updateStatusContact,
}
