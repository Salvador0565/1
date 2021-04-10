const mongoose = require('mongoose')
const { Schema } = mongoose
const almacenModelo = require('./ajsnAlmacen_Modelo')

const proveedorSchema = new Schema({
    idPersona:{
        type: Schema.Types.ObjectId,
        ref: 'Persona',
        required: [true, 'es necesario poner a a la persona']
    },
    strEmpresa:{
        type: String,
        required: [true, 'Es necesario saber de que empresa es']
    },
    strDireccionEmpresa:{
        type: String,
        required: [true, 'Es necesario saber donde esta la empresa']
    },
    ajsnAlmacen: [
        almacenModelo.schema
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
    collection: "proveedor"
})

module.exports = mongoose.model('Proveedor', proveedorSchema)