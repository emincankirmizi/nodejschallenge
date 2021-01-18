const { check } = require('express-validator');

const registerValidationArray = [
    check('name')
        .exists()
        .isLength({ min: 3, max: 255 }).withMessage('İsim en az 3 harfli olmalıdır.'),
    check('surname', 'Kullanıcı soyismi en az 3 harfli olmalıdır.')
        .exists()
        .isLength({ min: 3, max: 255 }).withMessage('Soyisim en az 3 harfli olmalıdır.'),
    check('email', 'Geçersiz mail adresi kabul edilemez.')
        .isEmail()
        .normalizeEmail()
        .isLength({ min: 3, max: 255 }).withMessage('Lütfen geçerli bir email adresi giriniz.'),
    check('language', 'Dil boş bırakılamaz.')
        .exists()
        .isLength({ min: 2, max: 255 }).withMessage('Dil seçeneği boş bırakılamaz.'),
    check('country')
        .exists()
        .isLength({ min: 2, max: 255 }).withMessage('Ülke boş bırakılamaz.'),
    check('password')
        .exists()
        .isLength({ min: 8, max: 1024 }).withMessage('Lütfen geçerli bir şifre giriniz.')
        .isStrongPassword().withMessage('Şifreniz en az ve en az 8 haneli alfanumerik standartı karşılamalıdır.'),
    check('confirmPassword', 'Girdiğiniz şifreler eşleşmelidir.')
        .exists()
        .custom((value, { req, loc, path }) => {
            if (value !== req.body.password) {
                throw new Error("Girdiğiniz şifreler eşleşmelidir.");
            } else {
                return value;
            }
        })
];


const loginValidationArray = [
    check('email', 'Geçersiz mail adresi kabul edilemez.')
        .isEmail()
        .normalizeEmail().withMessage('Lütfen geçerli bir email adresi giriniz.'),
    check('password')
        .exists()
        .isStrongPassword().withMessage('Lütfen geçerli bir şifre giriniz.'),
];

module.exports = {
    registerValidationArray,
    loginValidationArray
};