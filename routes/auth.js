const { Router } =  require('express');
const { login, register, restoreToken } = require('../controllers/auth');
const { validateJwt } = require('../middlewares/validateJwt');
const { check } = require('express-validator');
const { validateFields } = require('../middlewares/validateFields');


const router = Router();


router.get('/login',[], login);
router.post('/register', [
    check('name', 'el nombre no es valido').not().isEmpty(),
    check('mail', 'el correo no es valido').isEmail(),
    check('role', 'el rol no es valido').isIn(['USER_ROLE', 'ADMIN ROLE']),
    validateFields
], register )
router.get('/restore-token',[validateJwt], restoreToken );



module.exports = router;