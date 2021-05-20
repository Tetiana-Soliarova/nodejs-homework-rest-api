const Joi = require('joi')
const mongoose = require('mongoose')

const schemaCreateContact = Joi.object({
  name: Joi.string()
    .min(3)
    .max(30)
    .pattern(/[A-Z]\w+/)
    .required(),

  phone: Joi.string().length(12).required(),

  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),

  favorite: Joi.boolean().optional()
})

// --------------------------
const schemaQueryContact = Joi.object({
  sortBy: Joi.string() // сорт  по возрастанию
    .valid('name', 'phone', 'email', 'id')
    .optional(),
  sortByDesc: Joi.string() // сорт  по убыванию
    .valid('name', 'phone', 'email', 'id')
    .optional(),
  filter: Joi.string() // можно вернуть только оприделенные поля
    // .valid('name', 'phone', 'id')
    .optional(),

  limit: Joi.number().integer().min(1)
    .max(20).optional(), //  к-ство контактов на странице
  offset: Joi.number().integer().min(0).optional(), //  отступ
  favorite: Joi.boolean().optional()
}).without('sortBy', 'sortByDesc') // сортировка может быть только по возростанию или только по убыванию

// ------------------------------
const schemaUpdateContact = Joi.object({
  name: Joi.string()
    .min(3)
    .max(30)
    .optional(),

  phone: Joi.string().length(12)
    .optional(),
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).optional(),

  favorite: Joi.boolean().optional()
}).or('name', 'email', 'phone', 'favorite')

const schemaUpdateStatusContact = Joi.object({
  favorite: Joi.boolean().required()
})

const validate = async (schema, obj, next) => {
  try {
    await schema.validateAsync(obj)
    return next()
  } catch (err) {
    console.log(err)
    next({ status: 400, message: err.message.replace(/"/g, "'") })
  }
}

module.exports = {
  validationQueryContact: async (req, res, next) => {
    return await validate(schemaQueryContact, req.query, next)
  },
  validationCreateContact: async (req, res, next) => {
    return await validate(schemaCreateContact, req.body, next)
  },
  validateUpdateStatusContact: async (req, res, next) => {
    return await validate(schemaUpdateStatusContact, req.body, next)
  },
  validateUpdateContact: async (req, res, next) => {
    return await validate(schemaUpdateContact, req.body, next)
  },
  validateObjectId: async (req, res, next) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return next({ status: 400, message: 'Invalid ObjectId' })
    }
    next()
  },
}
