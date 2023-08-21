const { request, response } = require('express')
const Product = require('../models/product');
const Category = require('../models/category');



const getProductById = async (req = request, res = response) => {
    const { id } = req.params;


    if (!id) return res.status(400).json({
        msg: "Parametro en url [id] requerido en la petición",
        data: {},
        code: 400
    })

    const product = await Product.findById(id);

    if (!product) return res.status(400).json({
        msg: `Producto con nombre: [${productName}] no se encuentra`,
        data: { productName },
        code: 400
    })

    return res.status(200).json({
        msg: "Producto consultado con éxito",
        data: product,
        code: 200
    })

}


const getProductByName = async (req = request, res = response) => {
    const { name: productName } = req.body;

    if (!productName) return res.status(400).json({
        msg: "Parametro [name] requerido en cuerpo de la petición",
        data: {},
        code: 400
    })

    const product = await Product.findOne({ name: productName });

    if (!product) return res.status(400).json({
        msg: `Producto con nombre: [${productName}] no se encuentra`,
        data: { productName },
        code: 400
    })

    return res.status(200).json({
        msg: "Producto consultado con éxito",
        data: product,
        code: 200
    })

}


const getProducts = async (req = request, res = response) => {
    //middlewares necesarios: validatJwt, isAdminRole, IsValidCategory
    const { from, to } = req.query;
    const { categoryUid } = req;
    const queryOfDb = { state: true, category: categoryUid };

    console.log({queryOfDb, from, to})

    const [ total, products ] = await Promise.all([
        Product.countDocuments(queryOfDb),
        Product.find(queryOfDb)
            .populate('category', 'name')
            .skip( Number( from ) )
            .limit(Number( to))
    ]);


    return res.status(200).json({
        msg: '',
        data:  {
            total,
            products
        },
        code:200
    })

}

const addProduct = async (req = request, res = response) => {

    const { name, cost, description, profile_img, more_imgs } = req.body;
    const user = req.user;
    const category = req.categoryUid;

    const product = new Product({ name, user: user._id, cost, category, description, profile_img, more_imgs  })

    await product.save();

    res.status(200).json({
        msg: 'Producto añadido con exito',
        data: product,
        code: 200
    });

}

const modifyProduct = async (req = request, res = response) => {
    //middlewares necesarios: validateJwt, isAdminRole, getProductDataForModify
    const { id } = req.params;
    const previusProduct = req.product;
    const { name, cost, description, category, available, profile_img, more_imgs } = req.body;
 
    const moreImagesPrevius = Object.assign({}, previusProduct?.more_imgs); //clonacion de objeto
    const moreImgsUnion =  { ...(moreImagesPrevius), ...more_imgs }
    

    let product;
    if (!category) {
        product = await Product.findByIdAndUpdate(id, { name, cost, description, available, profile_img, more_imgs:moreImgsUnion  });
    } else {
        const nameCategory = category.toUpperCase();
        const ctg = await Category.findOne({ name: nameCategory });
        if(!ctg){
            return res.status(423).json({
                msg: `La categoria ${nameCategory} no exite`, 
                data: {},
                code:423
            })
        }

        if (!ctg.state) {
            return res.status(423).json({
                msg: `La categoria ${nameCategory} indicada no esta disponible`,
                data: {},
                code: 423
            })
        }
        product = await Product.findByIdAndUpdate(id, { name, cost, category: ctg._id, description, available, profile_img, more_imgs:moreImgsUnion  });
    }

    return res.status(200).json({
        msj: 'Producto modificado con éxito',
        data: product,
        code: 200
    })
}

const deleteProduct = async (req = request, res = response) => {
    const { id } = req.params;


    if (!id) return res.status(400).json({
        msg: "Parametro en url [id] requerido en la petición",
        data: {},
        code: 400
    })

    const product = await Product.findByIdAndDelete(id);

    if (!product) return res.status(400).json({
        msg: `Producto con nombre: [${productName}] no se encuentra`,
        data: { productName },
        code: 400
    })

    return res.status(200).json({
        msg: "Producto  con éxito",
        data: product,
        code: 200
    })
}



module.exports = {
    getProductById,
    getProductByName,
    getProducts,
    addProduct,
    modifyProduct,
    deleteProduct
}
