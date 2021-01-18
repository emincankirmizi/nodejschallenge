require('dotenv').config();
const path = require('path');
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const flash = require('connect-flash');
const bodyParser = require('body-parser');
const allRouters = require('./routers/initial-routes');
const { initSocket } = require('./helper/startSocket');
const app = express();
const mongoose = require('mongoose');
require('./helper/passport')(passport)

mongoose.connect(process.env.MONGO_DATABASE || 'mongodb+srv://admin:admin@localhost/users?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    socketTimeoutMS: 1000,
    connectTimeoutMS: 5000
}, (err) => {
    if (err) {
        console.log(err);
        process.exit(1);
    }
});

mongoose.connection.on('open', () => {
    console.log('MongoDB connection established.')
});

mongoose.connection.on('connected', () => {
    console.log('Connected to MongoDB.')
});

mongoose.connection.on('error', (err) => {
    console.log('Failed to connect!: ' + err)
    process.exit(1);
});


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(__dirname + '/views/static'));

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});

app.use('/', allRouters);

const port = process.env.PORT || 80;

const server = app.listen(port, () => {
    console.log(`Hello, I'm listening to ${port}`);
});

initSocket(server);
