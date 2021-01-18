const login = require('express').Router();
const user = require('../models/user');
const bcrypt = require('bcryptjs');
const { users, userInfo } = require('../helper/startSocket');
const validations = require('../helper/validatons');
const { check, validationResult } = require('express-validator');
const result = require('../helper/generate-result');
const send = require('../helper/send-result');
const passport = require('passport');

login.get('/', (req, res) => {
    res.redirect("/login");
});

login.get('/login', (req, res) => {
    res.render("login-page");
});

login.post('/login', validations.loginValidationArray, (req, res, next) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        req.flash('error_msg', errors.errors);
        res.redirect("/login")
    } else {
        passport.authenticate('local', {
            successRedirect: '/home',
            failureRedirect: '/login',
            failureFlash: true
        })(req, res, next);
    }
});


login.get('/version', (req, res) => {
    res.send('1.0.0');
});

module.exports = login;