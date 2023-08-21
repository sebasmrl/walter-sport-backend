const User = require("../models/user");
const Category = require("../models/category");
const Product = require("../models/product");

//requiere uso de validateJwt para su funcionamiento
const isAdminRole = async(req, res, next)=>{
    const { role } = req.user; 

    return ( role == 'ADMIN_ROLE') 
    ? next()
    :  res.status(401).json({
        msg: 'El usuario actual no tiene rol ADMINISTRADOR',
        data: { },
        code: 401
    })
}


//Adiciona req.categoryUid
const isValidCategory = async(req, res, next)=>{

    const { category } = req.body;
    const { nomCategory } = req.params;

   

    if(!(category || nomCategory)){
        return res.status(400).json({
            msg: 'Parametro [category] en body o [nomCategory] en params necesario en la peticion', 
            data: {},
            code:400
        })
    }

    let  nameCategory = "";
    (category)
        ? nameCategory = category.toUpperCase()
        : nameCategory = nomCategory.toUpperCase();

    console.log({nameCategory})
    const ctg =  await Category.findOne({ name: nameCategory});

    if(!ctg){
        return res.status(423).json({
            msg: `La categoria ${nameCategory} no exite`, 
            data: {},
            code:423
        })
    }

    if(!ctg.state){
        return res.status(423).json({
            msg: `La categoria ${nameCategory} no esta disponible`, 
            data: {},
            code:423
        })
    }

    req.categoryUid =  ctg._id;
    next()
}

const getProductDataForModify = async(req, res, next) => {

    const { id } = req.params;
    const {productId} = req.body;

    if( !(id || productId) ) {
        return res.status(400).json({ 
            msg: 'Paramentro en url [id] en url o [productId] en body necesarios en la petición',
            data: {},
            code: 400
        })
    }

    let product;
    
        (id)
        ? product = await Product.findById(id)
        : product = await Product.findById(productId);

        console.log(product)
    req.product = product;
    next();

}





module.exports = {
    isAdminRole,
    isValidCategory,
    getProductDataForModify
}