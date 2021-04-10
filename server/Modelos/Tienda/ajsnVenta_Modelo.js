const mongoose = require('mongoose')
const { Schema } = mongoose

const ventaSchema = new Schema({
    idPersona:{
        type: Schema.Types.ObjectId,
        ref: 'Persona'
    },
    dteFecha:{
        type: Date,
        required: [true, 'Es necesario poner la fecha']
    },
    nmbCantidad:{
        type: Number,
        required: [true, 'Es necesario poner la cantidad del producto']
    },
    nmbTotalPrecio:{
        type: Number,
        required: [true, 'Es necesario poner el precio del producto']
    },
    strMetodoPago:{
        type: String,
        required: [true, 'Es necesario poner el metodo de pago']
    },
    idProducto:{
        type: Schema.Types.ObjectId,
        ref: 'Producto'
    },
    blnActivo:{
        type: Boolean,
        default: true
    }
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    },
    collection: "venta"
})

module.exports = mongoose.model('Venta', ventaSchema)