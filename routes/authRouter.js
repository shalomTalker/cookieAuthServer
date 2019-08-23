const express = require('express');
const router = express.Router();
const debug = require('debug')('chatapp:routes')
const authController = require('../controllers/authController');
const expressJoiMiddleware = require('express-joi-middleware');
const joi  = require('joi');

const bodySchema = {
  body: {
    email: joi.string().email({ minDomainSegments: 2 }),
    password: joi.string().regex(/^[a-zA-Z0-9]{4,30}$/)
  },
};

router.route('/signup')
  .get(async (req, res, next) => {
    res.render('auth', { title: 'signup', redirect: 'login' });
  })
  .post(expressJoiMiddleware(bodySchema),authController.register);

router.route('/login')
  .get(async (req, res, next) => {
    res.render('auth', { title: 'login', redirect: 'signup' })
  })
  .post(expressJoiMiddleware(bodySchema),authController.login);

router.get('/logout',authController.logout)  

module.exports = router;
