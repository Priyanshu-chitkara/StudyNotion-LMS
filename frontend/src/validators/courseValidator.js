const { body } = require('express-validator');

const createCourseValidator = [
  body('title')
    .notEmpty()
    .withMessage('Title is required'),

  body('description')
    .notEmpty()
    .withMessage('Description is required'),

  body('price')
    .isNumeric()
    .withMessage('Price must be a number')
];

module.exports = {
  createCourseValidator,
};