const mongoose = require('mongoose')
const { Schema } = mongoose

const inventarioSchema = new Schema({
    idProducto:{
        type: Schema.Types.ObjectId,
        ref: 'Producto'
    },
    nmbCantidad:{
        type: Number,
        required: [true, 'Es necesario poner la cantidad del producto']
    },
    strCategoria:{
        type: String,
        required: [true, 'Es necesario poner la categoria a la que pertenece']
    },
    arrFechaIngreso:[
        {type: Date, required:[true, 'Es necesario colocar la fecha de ingreso del producto']}
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
    collection: "inventario"
})

module.exports = mongoose.model('Inventario', inventarioSchema)