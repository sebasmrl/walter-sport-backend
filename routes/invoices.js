const { Router } = require('express');
const {  getInvoices, addInvoice, modifyInvoice, deleteInvoice, getInvoiceById, getInvoiceByIdLikeAdmin, getInvoicesLikeAdmin } = require('../controllers/invoices');
const { validateJwt } = require('../middlewares/validateJwt');
const { isAdminRole } = require('../middlewares/dbMiddewares');



const router =  Router();



router.get('/admin/:id', [validateJwt, isAdminRole], getInvoiceByIdLikeAdmin);
router.get('/admin', [validateJwt, isAdminRole], getInvoicesLikeAdmin);
router.put('/admin/:id', [validateJwt, isAdminRole], modifyInvoice);
router.delete('/admin/:id', [validateJwt, isAdminRole], deleteInvoice);


router.get('/:id', [ validateJwt ], getInvoiceById);
router.get('/', [validateJwt], getInvoices);
router.post('/', [validateJwt], addInvoice);



module.exports = router;