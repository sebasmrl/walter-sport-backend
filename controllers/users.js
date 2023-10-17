const { request, response } = require('express')
const { uploadFile, fileUploadHelper, fileDeleteHelper } = require("../helpers/subir-archivo");
const User = require("../models/user");


const getUser = async (req, res) => {
    //Verificacion de token con valideJwt

    const {uid} = req?.user;
    const user = await User.findOne({ uid: uid })

    // Verificar si el email existe
    if (!user) {
        return res.status(401).json({
            msg: 'Uid no reconocido del token',
            data: {},
            code: 401
        });
    }

    // SI el usuario está activo
    if (!user.state) {
        return res.status(401).json({
            msg: 'Estado del usuario inactivo',
            data: { uid },
            code: 401
        });
    }

    return res.status(200).json({
        msj: 'Datos del usuario obtenidos con éxito',
        data: user,
        code: 200
    });

}
//const addUser = (req, res) =>{}

const modifyUser = async (req=request, res) => {

    //origen: middleware [validateToken]
    const { id} = req?.user;

    //#TODO subir archivo
    let img;
    try{
        const  user_img  = req.files?.user_img;
        img = await fileUploadHelper(user_img, 'users');
        if(req?.user?.img) fileDeleteHelper(req.user.img, 'users');
    }catch(e){
        console.warn(e);    
    }
    
    
    //const { id } = req.params;

    const { password, ...restoBody } = req.body;
    
    if (password) {
        const salt = bcryptjs.genSaltSync(10);
        restoBody.password = bcryptjs.hashSync(password, salt);
    }

    const user = (img)
        ? await User.findByIdAndUpdate(id, {img: img.data, ...restoBody} )
        : await User.findByIdAndUpdate(id, { ...restoBody} );


    res.status(200).json({
        msj: 'Usuario modificado con éxito',
        data: user,
        code: 200
    })
}


const deleteUser = async (req, res) => {
    res.status(200).json({
        msj: 'Usuario eliminado con éxito',
        data: {},
        code: 200
    })
}


module.exports = {
    getUser,
    modifyUser,
    deleteUser
    //addUser
}