const AppError = require('../utils/AppError');
const { findByEmail } = require('../data/students');

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const VALID_STATUSES = ['Active', 'Inactive'];
const ALLOWED_FIELDS = ['name', 'email', 'age', 'course', 'gpa', 'status'];

const fieldValidators = {
  name: (value) => {
    if (typeof value !== 'string' || value.trim().length === 0) {
      return 'Name must be a non-empty string';
    }
    return null;
  },
  email: (value) => {
    if (typeof value !== 'string' || !EMAIL_REGEX.test(value.trim())) {
      return 'Email must be a valid email address';
    }
    return null;
  },
  age: (value) => {
    const numericAge = Number(value);
    if (
      typeof value === 'boolean' ||
      !Number.isInteger(numericAge) ||
      numericAge < 15 ||
      numericAge > 100
    ) {
      return 'Age must be an integer between 15 and 100';
    }
    return null;
  },
  course: (value) => {
    if (typeof value !== 'string' || value.trim().length === 0) {
      return 'Course must be a non-empty string';
    }
    return null;
  },
  gpa: (value) => {
    const numericGpa = Number(value);
    if (
      typeof value === 'boolean' ||
      Number.isNaN(numericGpa) ||
      numericGpa < 0 ||
      numericGpa > 4
    ) {
      return 'GPA must be a number between 0 and 4';
    }
    return null;
  },
  status: (value) => {
    if (typeof value !== 'string' || !VALID_STATUSES.includes(value.trim())) {
      return "Status must be either 'Active' or 'Inactive'";
    }
    return null;
  }
};

const validateField = (field, value) => {
  const validator = fieldValidators[field];
  if (!validator) {
    return `Unexpected field: '${field}'`;
  }
  return validator(value);
};

const validateStudent = ({ isPartial = false } = {}) => {
  return (req, res, next) => {
    if (!req.body || typeof req.body !== 'object' || Array.isArray(req.body)) {
      return next(new AppError('Request body must be a valid JSON object', 400));
    }

    const bodyKeys = Object.keys(req.body);

    if (isPartial && bodyKeys.length === 0) {
      return next(new AppError('Request body must contain at least one field to update', 400));
    }

    if (!isPartial) {
      for (const field of ALLOWED_FIELDS) {
        if (req.body[field] === undefined) {
          return next(new AppError(`Missing required field: '${field}'`, 400));
        }
      }
    }

    for (const key of bodyKeys) {
      const error = validateField(key, req.body[key]);
      if (error) {
        return next(new AppError(error, 400));
      }
    }

    if (req.body.email) {
      const targetId = req.params ? req.params.id : null;
      const existingStudent = findByEmail(req.body.email, targetId);
      if (existingStudent) {
        return next(new AppError(`Email '${req.body.email}' is already registered`, 400));
      }
    }

    next();
  };
};

module.exports = validateStudent;
