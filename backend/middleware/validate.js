const { body, validationResult } = require("express-validator");

const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ message: errors.array()[0].msg });
  next();
};

const validateRegister = [
  body("name").trim().notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Valid email is required"),
  body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
  handleValidation,
];

const validateLogin = [
  body("email").isEmail().withMessage("Valid email is required"),
  body("password").notEmpty().withMessage("Password is required"),
  handleValidation,
];

const validateMessage = [
  body("content").trim().notEmpty().withMessage("Message content is required"),
  handleValidation,
];

module.exports = { validateRegister, validateLogin, validateMessage };
