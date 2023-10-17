const { request, response } = require('express');
const Invoice = require('../models/invoice');
const Product = require('../models/product');

const getInvoiceById = async (req = request, res = response) => {

    //Verificacion de token con valideJwt
    const { id } = req?.user;
    const idInvoice = req?.params?.id;


    

    if (!idInvoice) return res.status(400).json({
        msg: `Id del producto necesario en parametros de la petición`,
        data: {},
        code: 400
    });

    const invoice = await Invoice.findById(idInvoice);
    // Verificar si el email existe
    if (!invoice) {
        return res.status(401).json({
            msg: 'Factura no encontrada',
            data: {},
            code: 401
        });
    }


    if (!(invoice.owner == id)) return res.status(401).json({
        msj: 'No estas autorizado para acceder  esa factura',
        data: {},
        code: 401
    });


    return res.status(200).json({
        msg: 'Factura obtenida con éxito',
        data: invoice,
        code: 200
    })
}





const getInvoices = async (req = request, res = response) => {

     //Verificacion de token con valideJwt
     const { id } = req?.user;

     const numDocs = await Invoice.countDocuments({ owner: id});
     const invoices = await Invoice.find({ owner: id});
     
    if(numDocs == 0){
        return res.status(400).json({
            msg: 'No tienes facturas que mostrar',
            data: [numDocs, invoices],
            code: 400
        })
    }

    return res.status(200).json({
        msg: 'Facturas obtenidas con éxito',
        data: [numDocs, invoices],
        code: 200
    })
}


const addInvoice = async (req = request, res = response) => {

    const { id } = req?.user
    const { products } = req.body; // {  id_product: unids, ... } 


    console.log("UID: " + id)

    console.log('producccccts: ', products)
    if (!(Object.keys(products).length > 0)) return res.status(400).json({
        msg: 'No hay productos para hacer factura',
        data: [],
        code: 400
    })

    
    const invoice = new Invoice({ owner: id, products: products });
    await invoice.save();
    
    //Actualizacion del stock
    Object.keys(products).forEach( async(product)=> {
        const pprevius = await Product.findById(product);
        await Product.findByIdAndUpdate(product, { stock: (pprevius.stock - products[product]) });

    } );

    return res.status(200).json({
        msg: 'Factura añadida con éxito',
        data: invoice,
        code: 200
    })
}




const modifyInvoice = async (req = request, res = response) => {


    const { id } = req?.params;
    const { products } = req?.body;  //{ uidProduct: unids}

    console.log(products)

    if (!id) return res.status(400).json({
        msg: 'Id de factura necesario en la petición',
        data: {},
        code: 400
    })
    if (!products) return res.status(400).json({
        msg: 'No hay productos pra modificaar en la factura',
        data: {},
        code: 400
    })

    const invoicePrevius = await Invoice.findById(id);
    console.log(invoicePrevius)

    const productsUpdated = { ...invoicePrevius?.products, ...products };


    const newInvoice = await Invoice.findByIdAndUpdate(id, { products: productsUpdated });

    //Actualizacion del stock
    Object.keys(productsUpdated).forEach(async(p)=> {
        const pprevius = await Product.findById(p);
        await Product.findByIdAndUpdate(p, { stock: (pprevius.stock - productsUpdated[p]) });
    } )

    return res.status(200).json({
        msg: 'Factura modificada con éxito',
        data: newInvoice,
        code: 200
    })
}


const deleteInvoice = async (req = request, res = response) => {



    //Verificacion de token con valideJwt
    const idInvoice = req?.params?.id;
    

    if (!idInvoice) return res.status(400).json({
        msg: `Id del producto necesario en parametros de la petición`,
        data: {},
        code: 400
    });

    const invoice = await Invoice.findById(idInvoice);
    // Verificar si el email existe
    if (!invoice) {
        return res.status(401).json({
            msg: 'Factura no encontrada',
            data: {},
            code: 401
        });
    }


    /* if (!(invoice.owner == id)) return res.status(401).json({
        msj: 'No estas autorizado para acceder  esa factura',
        data: {},
        code: 401
    }); */


    const deletedInvoice = await Invoice.findByIdAndDelete(idInvoice);


    return res.status(200).json({
        msg: 'Factura eliminada con éxito',
        data: deletedInvoice,
        code: 200
    })
}



//Admin
const getInvoiceByIdLikeAdmin = async (req = request, res = response) => {

     
    //Verificacion de token con valideJwt
    const idInvoice = req?.params?.id;


    if (!idInvoice) return res.status(400).json({
        msg: `Id del producto necesario en parametros de la petición`,
        data: {},
        code: 400
    });

    const invoice = await Invoice.findById(idInvoice);
    // Verificar si el email existe
    if (!invoice) {
        return res.status(401).json({
            msg: 'Factura no encontrada',
            data: {},
            code: 401
        });
    }


    return res.status(200).json({
        msg: 'Factura obtenida con éxito',
        data: invoice,
        code: 200
    })
}


const getInvoicesLikeAdmin = async (req = request, res = response) => {

    const {from, to} = req.query;


    const numDocs = await Invoice.countDocuments({});
    const invoices = await Invoice.find({})
                            .skip(Number(from))
                            .limit(Number(to));
    
   if(numDocs == 0){
       return res.status(400).json({
           msg: 'No tienes facturas que mostrar',
           data: [],
           code: 400
       })
   }


    return res.status(200).json({
        msg: 'Facturas obtenidas con éxito',
        data: invoices,
        code: 200
    })
}


module.exports = {
    getInvoiceById,
    getInvoices,
    addInvoice,
    modifyInvoice,
    deleteInvoice,

    getInvoiceByIdLikeAdmin,
    getInvoicesLikeAdmin
}


