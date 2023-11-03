const http = require('http');
const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const { dbConnection } = require('../db/connect');


class Server{

    
    
    constructor(){
        this.app = express();
        this.port = process.env.PORT || 4000;
        this.server = http.createServer(this.app);

        this.paths = {
            auth: '/auth',
            users: '/users',
            products: '/products',
            categories: '/categories',
            invoices: '/invoices',
            testing: '/testing'
        }

        this.dbConnection();
        this.middlewares();
        this.routes();
    }

    
    async dbConnection(){
        await dbConnection();
    }

    middlewares(){
        this.app.use(cors())
        this.app.use(express.json())
        this.app.use(express.static('public'))
        
        //carga de archivos
        this.app.use(fileUpload({
            useTempFiles : true,
            tempFileDir : '/tmp/',
            createParentPath: true //crear carpetas automaticas si no existen
        }));
        
    }
    routes(){
        this.app.use( this.paths.auth, require('../routes/auth'));
        this.app.use( this.paths.users, require('../routes/users'));
        this.app.use( this.paths.products, require('../routes/products'));
        this.app.use( this.paths.categories, require('../routes/categories'));
        this.app.use(this.paths.invoices, require('../routes/invoices'));
        this.app.use( this.paths.testing, require('../routes/testing'));
    }

    listen(){
        this.app.listen(this.port, ()=>{
            console.log(`Servidor corriendo en el puerto: ${this.port}`);
        })
    }
}



module.exports = Server;