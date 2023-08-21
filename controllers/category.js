const Category = require('../models/category')


const addCategory = async(req, res)=>{
    const name  = req.body?.name?.toUpperCase();
    const user = req.user;
    
    if(!name) return res.status(400).json({ 
        msg: "Parametro [name] necesario en la peticion",
        data: {},
        code: 400
    })
    const ctg = await Category.findOne({ name: name});

    if(ctg)  return res.status(400).json({ 
        msg: `El nombre de la categoria : [${ctg.name}] ya se encuentra registrado`,
        data: { categoryName: ctg.name},
        code: 400
    })

    //console.log("usertojsonCategory", user._id)
    const  newCtg = new Category({name, user: user._id});
    await newCtg.save();


    return res.status(200).json({
        msg: "Categoria creada con éxito",
        data: { category: newCtg },
        code: 200
    })
}

const getCategoryById = async(req, res)=>{
    const { id } = req.params;
    
    if(!id) return res.status(400).json({ 
        msg: "Parametro [id] necesario en params de la peticion",
        data: {},
        code: 400
    })
    const ctg = await Category.findById(id);

    if(!ctg)  return res.status(400).json({ 
        msg: `La categoria con id: [${id}] no se encuentra registrada`,
        data: { categoryName: ctg.name},
        code: 400
    })

    if(!ctg.status)  return res.status(427).json({ 
        msg: `La categoria con id: [${id}] se encuentra registrada deshabilitada`,
        data: { id },
        code: 400
    })

    return res.status(200).json({
        msg: "Categoria obtenida con éxito",
        data: { category: ctg },
        code: 200
    })
}
const getAllCategories = async(req, res)=>{

    const queryOfDb = { state: true };
    const ctgs = await Category.find(queryOfDb);

    if(!ctgs)  return res.status(400).json({ 
        msg: `No existen categorias en la base de datos`,
        data: { categoryName: ctg.name},
        code: 400
    })

    return res.status(200).json({
        msg: "Lista de categorias obtenidas con éxito",
        data: { categories: ctgs},
        code: 200
    })
}




const modifyCategory = async(req, res)=>{
    //middlewares: validateJwt,, isAdminRole, isValidCategory
    const newname  = req.body?.newname?.toUpperCase();
    const {state} = req.body;

    const { category } = req.body;


    if(!category)return res.status(400).json({
            msg: 'Parametro [category] en body o [nomCategory] en params necesario en la peticion', 
            data: {},
            code:400
        })

    const nameCategory = category.toUpperCase()
    const lastCtg = await Category.findOne({ name: nameCategory})

    if(!lastCtg) return res.status(400).json({
        msg:`La categoria con nombre: ${nameCategory} no se encuentra registrada`,
        data:{},
        code:400
    })

    const  categoryUid = lastCtg._id;
    const ctg = await Category.findByIdAndUpdate(categoryUid,{ name: newname, state});


    return res.status(200).json({
        msg: "La categoria ha sido modificada con éxito",
        data: { category: ctg},
        code: 200
    })
}


const deleteCategory = async(req, res)=>{
    const { id } = req.params;
    
    if(!id) return res.status(400).json({ 
        msg: "Parametro [id] necesario en params de la peticion",
        data: {},
        code: 400
    })
    const ctg = await Category.findByIdAndDelete(id);

    return res.status(200).json({
        msg: "Categoria eliminada con éxito",
        data: { category: ctg },
        code: 200
    })
}


module.exports = {
    addCategory,
    getCategoryById,
    getAllCategories,
    modifyCategory,
    deleteCategory
}