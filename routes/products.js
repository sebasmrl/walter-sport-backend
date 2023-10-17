const { Router } =  require('express');
const {  getProducts, getProductById, addProduct, deleteProduct, modifyProduct, getProductByName, getProductsByName } = require('../controllers/products');
const { isAdminRole, isValidCategory, getProductDataForModify } = require('../middlewares/dbMiddewares');
const { validateJwt } = require('../middlewares/validateJwt');

const router = Router();




router.get('/:nomCategory', [ isValidCategory ], getProducts);

router.get('/byId/:id', [], getProductById)
router.get('/unit', [], getProductByName)
router.get('/', [], getProductsByName)  

router.post('/', [ validateJwt, isAdminRole, isValidCategory], addProduct);

router.put('/:id', [validateJwt, isAdminRole, getProductDataForModify], modifyProduct);

router.delete('/:id', [validateJwt, isAdminRole], deleteProduct);





module.exports = router;