const Joi = require('joi')

const schemaCreateContact = Joi.object({
  name: Joi.string()
    .min(3)
    .max(30)
    .required(),

  phone: Joi.string().length(12).required(),

  email: Joi.string()
    .email({
      minDomainSegments: 2, tlds: { allow: ['com', 'net'] }
    })
    .required()
})

const schemaUpdateContact = Joi.object({
  name: Joi.string()
    .min(3)
    .max(30)
    .optional(),

  phone: Joi.string().length(12)
    .optional(),

  email: Joi.string()
    .email({
      minDomainSegments: 2, tlds: { allow: ['com', 'net'] },
    })
    .optional()
}).or('name', 'phone', 'email')

const schemaUpdateStatusContact = Joi.object({
  name: Joi.string()
    .min(3)
    .max(30)
    .optional(),

  phone: Joi.string().length(12)
    .optional(),

  email: Joi.string()
    .email({
      minDomainSegments: 2, tlds: { allow: ['com', 'net'] },
    })
    .required()
})

const validate = async (schema, obj, next) => {
  try {
    await schema.validateAsync(obj)
    return next()
  } catch (err) {
    next({ status: 400, message: err.message })
  }
}

module.exports = {
  validationCreateContact: async (req, res, next) => {
    return await validate(schemaCreateContact, req.body, next)
  },
  validationUpdateContact: async (req, res, next) => {
    return await validate(schemaUpdateContact, req.body, next)
  },
  validationUpdateStatusContact: async (req, res, next) => {
    return await validate(schemaUpdateStatusContact, req.body, next)
  }
}
