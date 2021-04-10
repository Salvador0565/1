const mongoose = require('mongoose')
const { Schema } = mongoose

const prodcutoSchema = new Schema({
    strNombre:{
        type: String,
        required: [true, 'Se necesita que introduzca el nombre del producto']
    },
    strDescripcion: String,
    blnActivo:{
        type: Boolean,
        default: true
    }
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    },
    collection: "producto"   
})

module.exports = mongoose.model('Producto', prodcutoSchema)