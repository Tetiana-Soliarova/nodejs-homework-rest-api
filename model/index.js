const Contact = require('./schemas/contact')

const listContacts = async (userId, query) => {
  const {
    sortBy,
    sortByDesc,
    filter,
    favorite = null,
    limit = 5,
    page = 1,
    offset = 0
  } = query

  const optionsSearch = { owner: userId }
  if (favorite !== null) {
    optionsSearch.favorite = favorite
  }
  const results = await Contact.paginate(optionsSearch, {
    limit,
    offset,
    page,
    sort: {
      ...(sortBy ? { [`${sortBy}`]: 1 } : {}), // name: 1
      ...(sortByDesc ? { [`${sortByDesc}`]: -1 } : {}), // name: -1
    },
    select: filter ? filter.split('|').join(' ') : '',
    populate: ({
      path: 'owner',
      select: 'name email gender -_id'
    })
  }
  )

  const { docs: contacts, totalDocs: total } = results
  return { contacts, total, limit, offset, page }
  // return results
}

const getContactById = async (userId, id) => {
  const result = await Contact.findOne({ _id: id, owner: userId }).populate({
    path: 'owner',
    select: 'name email gender -_id'
  })
  return result
}

const removeContact = async (userId, id) => {
  const result = await Contact.findByIdAndRemove({ _id: id, owner: userId })
  return result
}

const addContact = async (userId, body) => {
  try {
    const results = await Contact.create({ ...body, owner: userId })
    return results
  } catch (e) {
    if (e.name === 'ValidationError') {
      e.status = 400
    }
    throw e
  }
}

const updateContact = async (userId, id, body) => {
  const result = await Contact.findByIdAndUpdate(
    { _id: id, owner: userId },
    { ...body },
    { new: true }
  )
  return result
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
}
