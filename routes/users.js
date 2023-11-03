const { Router } =  require('express');
const { getUser, addUser, modifyUser, deleteUser } = require('../controllers/users');
const { validateJwt } = require('../middlewares/validateJwt');


const router = Router();


router.post('/',[validateJwt], getUser); 
//router.post('/',[], addUser);
router.put('/',[validateJwt], modifyUser);
router.delete('/', [validateJwt], deleteUser);


module.exports = router;