const http = require('http');
const express = require('express');
const cors = require('cors');
const { dbConnection } = require('../db/connect');


class Server{

    
    
    constructor(){
        this.app = express();
        this.port = process.env.PORT || 4000;
        this.server = http.createServer(this.app);

        this.paths = {
            auth: '/auth',
            users: '/users',
            products: '/products'
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
    }
    routes(){
        this.app.use( this.paths.auth, require('../routes/auth'));
        this.app.use( this.paths.users, require('../routes/users'));
    }

    listen(){
        this.app.listen(this.port, ()=>{
            console.log(`Servidor corriendo en el puerto: ${this.port}`);
        })
    }
}



module.exports = Server;