const mongoose = require('mongoose')
const { Schema } = mongoose

const almacenSchema = new Schema({
    idProducto:{
        type: Schema.Types.ObjectId,
        ref: 'Producto',
        required: [true, 'Tienes que poner el id del producto']
    },
    nmbCantidad:{
        type: Number,
        required: [true, 'Tienes que poner la cantidad a agregar']
    },
    strCategoria:{
        type: String,
        required: [true, 'Tienes que poner la categoria a la que pertenece']
    },
    arrFechaIngreso:[
        {
            type: Date,
            required: [true, 'Tienes que poner la fecha en que se ingreso el producto']
        }
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
    collection: "almacen"
})

module.exports = mongoose.model('Almacen', almacenSchema)