const path = require('path')
const fs =  require('fs')
const { v4: uuidv4 } = require('uuid');



const subirArchivo = (files, extensionesValidas = ['png', 'jpg', 'jpeg', 'gif'], carpeta='') => {

    return new Promise((resolve, reject) => {

        
        const { archivo } = files;
        const extension = archivo.name.split('.').pop();


        if (!extensionesValidas.includes(extension))
            return reject({ 
                msg: `La extensión [${extension}] no es permitida, solo [${extensionesValidas}]`,
                data: archivo.name,
                code:400
            });

        
        const nombreTemporaldelArchivo = uuidv4() + '.' + extension;
        const PathdeCarga = path.join(__dirname, '../uploads/', carpeta, nombreTemporaldelArchivo);

        //mover el archivo temporal a una carpeta especifica
        archivo.mv(PathdeCarga, (err) => {
            if (err) {
                return reject({ 
                    msg: `Error: ${err}`,
                    data: archivo.name,
                    code:500
                })
            }

           return resolve({
                msg: `Archivo guardado en la ruta: ${PathdeCarga}`,
                data: nombreTemporaldelArchivo,
                code: 200
            });
        });

    })


}




const fileUploadHelper = async( file, folder='', validExtensions=['jpg', 'png', 'jpeg']  ) => {
    
    
    return new Promise((resolve, reject) => {

        if (!file ) {
            return reject({ 
                msg: `No hay archivo para guardar`,
                data: "",
                code:400
            });
        }

        const extension = file.name.split('.').pop();
        if (!validExtensions.includes(extension))
            return reject({ 
                msg: `La extensión [${extension}] no es permitida, solo [${validExtensions}]`,
                data: file.name,
                code:400
            });

        
        const nombreTemporaldelArchivo = uuidv4() + '.' + extension;
        const PathdeCarga = path.join(__dirname, '../public/uploads/', folder, nombreTemporaldelArchivo);

        //mover el archivo temporal a una carpeta especifica
        file.mv(PathdeCarga, (err) => {
            if (err) {
                return reject({ 
                    msg: `Error: ${err}`,
                    data: file.name,
                    code:500
                })
            }

           return resolve({
                msg: `Archivo guardado en la ruta: ${PathdeCarga}`,
                data: nombreTemporaldelArchivo,
                code: 200
            });
        });

    })

}


const fileDeleteHelper = (fileName, folder) =>{
    
    if(!fileName) return;
    const pathImg = path.join(__dirname, '../public/uploads', folder, fileName);
    if(fs.existsSync(pathImg)){
        fs.unlinkSync(pathImg);
        return true;
    }
    return false;
}





module.exports = {
    subirArchivo,
    fileUploadHelper,
    fileDeleteHelper
};