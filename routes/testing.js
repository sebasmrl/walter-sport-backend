const { Router}  = require('express');
const { check } = require('express-validator')
const { cargarArchivo, actualizarImagen } = require('../controllers/testing');
const { validateFields } = require('../middlewares/validateFields');
const { collectionsAvailables } = require('../helpers/dbValidators');
const { fileUploadHelper } = require('../helpers/subir-archivo');

const { request, response } = require('express')


const router =  Router();


router.post('/pruebas', [], async (req, res)=>{


    const {img} = req.files;
    let file;
    try {
         file = await fileUploadHelper(img); 
        
    } catch (error) {
        file = error;
    }

    return res.json(file)
  

})


router.post('/',[], cargarArchivo);

router.put('/:coleccion/:id',[
    check('id', 'El id debe ser de Mongo').isMongoId(),
    check('coleccion').custom( (c)=>{
        return collectionsAvailables(c, ['usuarios', 'productos'])
    }),
    validateFields
], actualizarImagen);







module.exports = router;