const { addCategory, modifyCategory, getCategoryById, deleteCategory, getAllCategories } = require('../controllers/category');
const { isAdminRole, isValidCategory } = require('../middlewares/dbMiddewares');
const { validateJwt }= require('../middlewares/validateJwt')
const { Router } = require('express');


const router =  Router();

router.get('/:id', [], getCategoryById)
router.get('/', [], getAllCategories)
router.post('/',[ validateJwt, isAdminRole ], addCategory);
router.put('/', [validateJwt, isAdminRole], modifyCategory)
router.delete('/:id', [validateJwt, isAdminRole], deleteCategory)




module.exports = router;