const home = require('express').Router();
const { isAuth } = require('../helper/auth');

home.get('/', isAuth, (req, res) => {
    const user = req.user;
    const userInfo = {
        id: user._id,
        name: user.name,
        surname: user.surname,
        email: user.email,
        language: user.language,
        country: user.country,
        registerDate: user.date.toLocaleDateString()
    }

    res.render("home", { userInfo: userInfo });
});

module.exports = home;