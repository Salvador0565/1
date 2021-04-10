const mongoose = require('mongoose')
const { Schema } = mongoose
const ventaModelo = require('./ajsnVenta_Modelo')
const inventarioModelo = require('./ajsnIneventario_Modelo')

const tiendaSchema = new Schema({
    strNombre:{
        type: String,
        required: [true, 'Es necesario poner el nombre de la tienda']
    },
    strDireccion:{
        type: String,
        required: [true, 'Es necesario poner la direccion de la tienda']
    },
    strTelefono:{
        type: String,
        required: [true, 'Es necesario poner poner el telefono']
    },
    strUrlWeb:{
        type: String,
    },
    arrSucursales:[
        {type: String}
    ],
    ajsnVenta:[ventaModelo.schema],
    ajsnInventario: [inventarioModelo.schema],
    arrProveedores:[
        {type: String}
    ],
    blnActivo:{
        type: Boolean,
        default: true
    }
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    },
    collection: "tienda"
})

module.exports = mongoose.model('Tienda', tiendaSchema)