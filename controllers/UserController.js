const User = require('../models/UserModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

module.exports.createUser = (req, res) => {
    let {firstName, lastName, email, password, password2} = req.body;

    // checks the format of the email, length of passwords, and if they match
    validateRegistration(req, res, firstName, lastName, email, password, password2);

    // checks if the user already exists
    User.findOne({email})
    .then(found => {
        if(found) {
            res.status(403).json({
                message: 'Email already exists.'
            });
        } else {
            // this uses bcrypt to hash the password and then saves it to mongodb
            saveUserToDB(req, res, firstName, lastName, email, password);
        };
    })
    .catch(err => {
        errorHandling(err, res);
    });
};

module.exports.loginUser = (req, res) => {
    let {email, password} = req.body;

    if(!email || !password) {
        res.status(401).json('Please fill in your email and password.');
    };

    User.findOne({email})
    .then(user => {
        if(user) {
            bcrypt.compare(password, user.password)
            .then(match => {
                if(match === true) {
                    const opts = {expiresIn: '1d'};
                    const secret = process.env.SECRET_KEY;
                    const token = jwt.sign({id: user._id}, secret, opts);
                    res.json({
                        message: 'Successfully logged in.',
                        token
                    });
                } else {
                    res.status(403).json({
                        message: 'Incorrect password.'
                    });
                };
            })
            .catch(err => errorHandling(err, res));
        } else {
            res.status(403).json({
                message: 'This email is not registered.'
            });
        };
    })
    .catch(err => errorHandling(err, res));
};

function errorHandling(err, res) {
    console.error(err);
    res.status(500).json({message: 'Something went wrong.'});
};

function validateRegistration(req, res, firstName, lastName, email, password, password2) {
    let errors = [];

    if(!firstName || !lastName || !email || !password || !password2) {
        res.status(403).json({
            message: 'Please fill out every field.'
        });
    };
    
    if(/^[\w]+\@[\w]+\.com$/.test(email) === false) {
        errors.push('Please enter a valid email. Ex. example@example.com');
    };

    if(/^[A-Za-z]+$/.test(firstName.trim()) === false || /^[\w]+$/.test(lastName.trim()) === false) {
        errors.push('Name can only contain letters from A-Z.');
    };

    if(firstName.length < 2 || lastName.length < 2) {
        errors.push('Please do not use initials.');
    };

    if(password !== password2) {
        errors.push('Passwords must match.');
    };

    if(password.length < 6) {
        errors.push('Password must be 6 characters or longer.');
    };

    // if there are any errors, send 403 status
    if(errors.length > 0) {
        res.status(403).json({
            message: errors
        });
    };
};

function saveUserToDB(req, res, firstName, lastName, email, password) {
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(password, salt, (err, hash) => {
            let userInfo = {
                firstName,
                lastName,
                email,
                password: hash
            };
    
            console.log(userInfo);
            new User(userInfo).save()
            .then((user) => {
                res.json({
                    message: 'Success!',
                    user
                });
            })
            .catch(err => {
                errorHandling(res, err);
            });
        });
    });
};