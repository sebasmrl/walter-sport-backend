# Bakend tienda deportiva "WalterSport"
### Autor: Ing. Deivy S. Morales

## 1 - Adiciona el archivo .env
Dentro de él establece las siguientes variables de entorno:
 - 1.  PORT=4001

- 2. MONGODB_CNN=mongodb+srv://nombreDeUsuario:Constraseña@NombreDeCluster.9mzvp.mongodb.net/nombreDeDB?retryWrites=true&w=majority
- 3. SECRET_OR_PRIVATE_KEY=unTextoCualquieraConDiferentesCaracteres


## 2 - Modifica el nombre del parametro header en el cual enviaras tu token de autenticacion
Dirigite a la carpeta middlewares, archivo "validateJwt" y modifica el nombre
    `const token = req.header('waltersport-token')`;


## 3 - Ejecuta el servidor 
Para iniciar el servidor ejecuta en la consola, posicionandote en la carpeta raiz del proyecto el comando: 
    `node app` 

