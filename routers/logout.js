const logout = require('express').Router();

logout.get('/', (req, res) => {
    req.logout();
    res.redirect('/login');
});

module.exports = logout;