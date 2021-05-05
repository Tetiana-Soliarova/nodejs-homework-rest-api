const { v4: uuidv4 } = require('uuid')

const fs = require('fs/promises')
const path = require('path')

const contentType = path.join(__dirname, './', 'contacts.json')

function errHandle(err) {
  console.log(err.messege)
}

const listContacts = async () => {
  try {
    const contacts = await fs.readFile(contentType)
    const parsedContacts = JSON.parse(contacts)
    return parsedContacts
  } catch (err) {
    errHandle(err)
  }
}

const getContactById = async (id) => {
  try {
    const contactsList = await listContacts()
    const getContact = contactsList.find((contact) => contact.id == id)
    return getContact
  } catch (err) {
    errHandle(err)
  }
}

const addContact = async (data) => {
  try {
    const id = uuidv4()
    const contacts = await fs.readFile(contentType)
    const parsedContacts = JSON.parse(contacts)
    const bodyC = { id, ...data }
    fs.writeFile(contentType, JSON.stringify([bodyC, ...parsedContacts], null, 2))
  } catch (err) {
    errHandle(err)
  }
}

const updateContact = async (id, body) => {
  try {
    const contactsList = await listContacts()
    const getContact = contactsList.find((contact) => contact.id == id)
    Object.assign(getContact, body)
    await fs.writeFile(contentType, JSON.stringify(contactsList, null, 2))
    return getContact.id ? getContact : null
  } catch (err) {
    errHandle(err)
  }
}

const removeContact = async (contactId) => {
  try {
    const contactsList = await listContacts()
    const newList = contactsList.filter(({ id }) => id !== contactId)
    await fs.writeFile(contentType, JSON.stringify(newList))
  } catch (err) {
    errHandle(err)
  }
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
}

//*  ------------- С Исп. базы данных lowdb ------------------------------- */
// const db = require('./db')
/*
const listContacts = async () => {
  return db.get('contacts').value()
}

const addContact = async (body) => {
  const id = uuidv4()

  const record = {
    id,
    ...body
  }
  db.get('contacts').push(record).write()
  return record
}

const getContactById = async (id) => {
  return db.get('contacts').find({ id }).value()
}

const updateContact = async (id, body) => {
  const record = db.get('contacts').find({ id }).assign(body).value()
  db.write()
  return record.id ? record : null
}

const removeContact = async (id) => {
  const [record] = db.get('contacts').remove({ id }).write()
  return record
}
*/
