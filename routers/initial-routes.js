const allRoutes = require('express').Router();
const login = require('./login');
const { register } = require('./register');
const home = require('./home');
const user = require('./user');
const logout = require('./logout');


allRoutes.use((req, res, next) => {
    console.log(`Request: ${req.method} ${req.originalUrl} ${req.hostname}`);
    next();
});

allRoutes.use('/', login);
allRoutes.use('/logout', logout);
allRoutes.use('/register', register);
allRoutes.use('/home', home);
allRoutes.use('/user', user);

module.exports = allRoutes;