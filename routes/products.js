const { Router } =  require('express');
const { getProduct, getProducts, getProductById, addProduct, deleteProduct, modifyProduct } = require('../controllers/products');

const router = Router();




router.get('/:nomCategoria', [], getProducts);

router.get('/:id', [], getProductById)

router.post('/', [], addProduct);

router.put('/:id', [], modifyProduct);

router.delete('/:id', [], deleteProduct);





module.exports = router;