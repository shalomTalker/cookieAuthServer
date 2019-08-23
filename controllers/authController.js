const mongoose = require('mongoose')
const User = mongoose.model('users')
const createError = require('http-errors');

module.exports = {
    register: async (req, res, next) => {
        try {
            const { email, password } = req.body;
            const existUser = await User.findOne({ email: email });
            if (existUser) {
                return next(createError(403,'This email address is already exists!' ));
            }
            const newUser = new User({
                email,
                password,
            })
            await newUser.save();
            req.session.user = newUser;
            res.redirect('/');
        } catch (error) {
            next(createError(500, 'something wrong...'));
        }
        
    },
    login: async (req, res, next) => {
        try {
            const { email, password } = req.body;
            const existUser = await User.findOne({ email });
            if (!existUser) {
                return next(createError(403,'This email address is not exists!'));
            }
            const isValid = await existUser.isValidPassword(password);
            if (isValid) {
                req.session.user = existUser;
                res.redirect('/');
            } else {
                return next(createError(403,'This password is not match!'));
            }
            
        } catch (error) {
            next(createError(500, 'something wrong...'));

        }
    },
    getCurrentUser: (req, res) => {
        res.status(200).send(req.user);
    },
    logout: (req, res) => {
        if (req.session.user && req.cookies.user_sid) {
            res.clearCookie('user_sid');
        }
        res.redirect('/auth/login');
    }
}