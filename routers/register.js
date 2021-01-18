const register = require('express').Router();
const User = require('../models/user');
const { validationResult } = require('express-validator');
const validations = require('../helper/validatons');
const result = require('../helper/generate-result');
const send = require('../helper/send-result');
const bcrypt = require('bcryptjs');
const { publisher } = require('../helper/startSocket')

register.get('/', (req, res) => {
    res.render("register");
});

register.post('/', validations.registerValidationArray, async (req, res) => {
    const errors = validationResult(req)
    const { name, surname, email, language, country, password } = req.body;
    if (errors.isEmpty()) {

        try {
            const isEmailExist = await User.findOne({ email: email });
            if (isEmailExist) {
                req.flash('error_msg', { msg: 'Kayıtlı email bulundu.', param: 'email' });
                return res.redirect('/register');
            }

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            // users[email] = req.body;
            const user = new User({
                name: name,
                surname: surname,
                email: email,
                language: language,
                country: country,
                password: hashedPassword
            });
            const savedUser = await user.save();
            const userInfo = `${name} ${surname}`;
            publisher.publish('newRegister', userInfo);
            req.flash('success_msg', 'Kaydınız başarılı bir şekilde gerçekleşti.');
            res.redirect("/login");
        } catch (err) {
            console.log(err)
            result(null, -1, err).then(data => {
                send(res, data, 400)
            });
        }
    } else {
        req.flash('error_msg', errors.errors);
        res.redirect('/register');
    }
});

module.exports = {
    register
};