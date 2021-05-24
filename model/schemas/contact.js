const mongoose = require('mongoose')
const { Schema, model, SchemaTypes } = mongoose
const mongoosePaginate = require('mongoose-paginate-v2')

const contactSchema = new Schema({
  name: {
    type: String,
    require: [true, 'Set name for contact']
  },
  phone: {
    type: String,
  },
  email: {
    type: String,
  },
  favorite: {
    type: Boolean,
    default: false,
  },
  owner: {
    type: SchemaTypes.ObjectId,
    ref: 'user',
  }
},
{
  versionKey: false,
  timestamps: true
}

)

contactSchema.path('name').validate((value) => {
  const re = /[A-Z]\w+/
  return re.test(String(value))
})
/*
contactSchema.path('email').validate((value) => {
  const re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
  return re.test(String(value))
})
*/

contactSchema.plugin(mongoosePaginate)

const Contact = model('contact', contactSchema)

module.exports = Contact
