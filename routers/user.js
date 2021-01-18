const user = require('express').Router();
const { isAuth } = require('../helper/auth');
const result = require('../helper/generate-result');
const send = require('../helper/send-result');
const User = require('../models/user');

user.get('/:userId', async (req, res) => {
    try {
        const user = await User.findById(req.params.userId).select({ _id: 0, password: 0, __v: 0 });
        result(user).then(data => {
            send(res, data);
        });
    } catch (err) {
        console.log(err);
        result().then(data => {
            send(res, data);
        });
    }
});

module.exports = user;