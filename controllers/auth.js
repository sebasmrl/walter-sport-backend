const { request, response } = require('express');
const User = require('../models/user');
const bcryptjs = require('bcryptjs');
const { generateJwt } = require('../helpers/generateJwt');
const { fileUploadHelper } = require('../helpers/subir-archivo');



const login = async (req = request, res = response) => {

    const { email, password } = req.body;

    console.log(req.body)
    console.log("email " +email, "pass"+password)

    const user = await User.findOne({ email: email });
    
    // Verificar si el email existe
    if (!user) {
        return res.status(400).json({
            msg: 'Usuario / Password no son correctos - correo',
            data: {email, password},
            code: 400
        });
    }

    // SI el usuario está activo
    if (!user.state) {
        return res.status(400).json({
            msg: 'Estado del usuario: inactivo',
            data: { userStaye: user.state },
            code: 400
        });
    }

    // Verificar la contraseña
    const validPassword = bcryptjs.compareSync(password, user.password);

    if (!validPassword) {
        return res.status(401).json({
            msg: 'Contraseña erronea para el usuario especificado',
            data: { password: password },
            code: 401
        });
    }

    console.log("login", user._id)
    const token = await generateJwt(user._id);
    return res.status(200).json({
        msj: 'Session Iniciada con éxito',
        data: {
            token: token
        },
        code: 200
    });
}



const register = async (req = request, res = response) => {


    //#TODO subir archivo
    let img;
    try{
        const  user_img  = req.files?.user_img;
        img = await fileUploadHelper(user_img);
    }catch(e){
         console.warn(`Advertencia: Imagen al registrase: ${e?.msg}`);
    }

    const { name, email, password, role } = req.body;


    const user = (img) 
        ? new User({ name, email, password, role, img: img.data })
        : new User({ name, email, password, role });


    try {

        const salt = bcryptjs.genSaltSync(10);
        user.password = bcryptjs.hashSync(password, salt);

        await user.save();
    } catch (error) {
        console.log("Error:", error)
        return res.status(400).json({
            msj: "Error al registrar el usuario",
            data: error.message,
            code: 400
        });
    }

    return res.status(200).json({
        msj: 'Usuario registrado con exito',
        data: user,
        code: 200
    });
}


const restoreToken = async (req = request, res = response) => {
    //validacion  de token en middleware
    const token = await generateJwt(req?.user?.uid);
    res.status(200).json({
        msj: 'Token restaurado con exito',
        data: token,
        code: 200
    });
}



module.exports = {
    login,
    register,
    restoreToken,
}
