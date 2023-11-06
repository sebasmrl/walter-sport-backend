const { request, response } = require('express')
const Product = require('../models/product');
const Category = require('../models/category');
const { fileUploadHelper, fileDeleteHelper } = require('../helpers/subir-archivo');



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
const getProductsByName = async (req = request, res = response) => {
    const { name: productName } = req.body;
    const { from, to } = req.query;


    if (!productName) return res.status(400).json({
        msg: "Parametro [name] requerido en cuerpo de la petición",
        data: {},
        code: 400
    })

    const products = await Product.find({ name: productName })
                        .skip(Number(from))
                        .limit(Number(to));

    if (products.length == 0) return res.status(400).json({
        msg: `Productos con nombre: [${productName}] no se encuentran`,
        data: { productName },
        code: 400
    })

    return res.status(200).json({
        msg: "Producto consultado con éxito",
        data: products,
        code: 200
    })

}


const getProducts = async (req = request, res = response) => {
    //middlewares necesarios: validatJwt, isAdminRole, IsValidCategory
    const { from, to } = req.query;
    const { categoryUid } = req;
    const queryOfDb = { state: true, category: categoryUid };

    //console.log({ queryOfDb, from, to })

    const [total, products] = await Promise.all([
        Product.countDocuments(queryOfDb),
        Product.find(queryOfDb)
            .populate('category', 'name')
            .skip(Number(from))
            .limit(Number(to))
    ]);


    return res.status(200).json({
        msg: 'Productos Obtenidos con exito',
        data: {
            total,
            products
        },
        code: 200
    })

}

const addProduct = async (req = request, res = response) => {

    let pImg;
    let more_imgs={};

    try {
        let img1, img2, img3;
        //requerir archivos si existen
        const { principal_img, image1, image2, image3 } = req.files;

        //#TODO Subir Archivos
        if (principal_img) { pImg = await fileUploadHelper(principal_img, 'products'); }
        if (image1) { img1 = await fileUploadHelper(image1, 'products'); }
        if (image2) { img2 = await fileUploadHelper(image2, 'products'); }
        if (image3) { img3 = await fileUploadHelper(image3, 'products'); }

        more_imgs = { img1: img1?.data, img2: img2?.data, img3: img3?.data }

    } catch (e) {
        console.warn("Warning: ", e);
    }

    const { name, cost, description, stock/*  profile_img, more_imgs  */ } = req?.body;
    const user = req.user;
    const category = req?.categoryUid;

    const product = new Product({ name, user: user._id, cost, category, description, stock, profile_img: pImg?.data, more_imgs: more_imgs || {} })


    try{
        await product.save();
    }catch (e) {
        return res.status(400).json({
            msg: 'Producto ya se encuentra añadido',
            data: name,
            code: 400
        });     
    }

    return res.status(200).json({
        msg: 'Producto añadido con exito',
        data: product,
        code: 200
    });

}




const modifyProduct = async (req = request, res = response) => {
    //middlewares necesarios: validateJwt, isAdminRole, getProductDataForModify
    const { id } = req.params;
    const previusProduct = req.product;

    //globales
    let pImg;
    let more_imgs={};


    try {
        let img1, img2, img3;
        const { principal_img, image1, image2, image3 } = req.files;

        //#TODO Subir Archivos
        if (principal_img) { 
            pImg = await fileUploadHelper(principal_img,  'products'); 
            fileDeleteHelper(previusProduct?.profile_img, 'products');
        }
        if (image1) { 
            img1 = await fileUploadHelper(image1,  'products');
            fileDeleteHelper(previusProduct?.more_imgs?.img1, 'products');
        }
        if (image2) { 
            img2 = await fileUploadHelper(image2, 'products'); 
            fileDeleteHelper(previusProduct?.more_imgs?.img2, 'products');
        }
        if (image3) { 
            img3 = await fileUploadHelper(image3, 'products'); 
            fileDeleteHelper(previusProduct?.more_imgs?.img3, 'products');
        }

        more_imgs = { img1: img1?.data, img2: img2?.data, img3: img3?.data }
    } catch (e) {
        console.warn('Warning: ', e);
    }
    


    const { name, cost, description, category, stock } = req?.body;

    const moreImagesPrevius = Object.assign({}, previusProduct?.more_imgs); //clonacion de objeto
    //console.log("moreImgesPrevius", moreImagesPrevius)
    
    
    //--------------------------------------------------
    let moreImgsUnion;
    let profileImgFinal;


    moreImgsUnion = (Object.keys(more_imgs).length > 0)
        ?  { ...moreImagesPrevius, ...more_imgs }
        :  moreImagesPrevius;

    (pImg)
        ? profileImgFinal = pImg?.data
        : profileImgFinal = previusProduct.profile_img


        console.log("moreImgUnion", moreImgsUnion)
        console.log("profileImgFinal", profileImgFinal)


    //--------------------------------------------------
    let product;
    if (!category) {
        product = await Product.findByIdAndUpdate(id, { name, cost, description, stock, profile_img: profileImgFinal, more_imgs: moreImgsUnion });
    } else {
        const nameCategory = category.toUpperCase();
        const ctg = await Category.findOne({ name: nameCategory });
        if (!ctg) {
            return res.status(423).json({
                msg: `La categoria ${nameCategory} no exite`,
                data: {},
                code: 423
            })
        }

        if (!ctg.state) {
            return res.status(423).json({
                msg: `La categoria ${nameCategory} indicada no esta disponible`,
                data: {},
                code: 423
            })
        }
        product = await Product.findByIdAndUpdate(id, { name, cost, category: ctg._id, description, stock, profile_img: profileImgFinal, more_imgs: moreImgsUnion });
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

    fileDeleteHelper(product?.profile_img,  'products');
    fileDeleteHelper(product?.more_imgs?.img1,  'products');
    fileDeleteHelper(product?.more_imgs?.img2,  'products');
    fileDeleteHelper(product?.more_imgs?.img3,  'products');

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
    getProductsByName,
    getProducts,
    addProduct,
    modifyProduct,
    deleteProduct
}
