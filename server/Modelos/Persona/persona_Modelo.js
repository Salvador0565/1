const mongoose = require('mongoose')
const { Schema } = mongoose

const personaSchema = new Schema({
    strNombre: {
        type: String,
        required: [true, 'Es necesario su nombre']
    },
    strApellidos:{
        type: String,
        required: [true, 'Es necesario sus apellidos']
    },
    strDirecion:{
        type: String,
        required: [true, 'Es necesario su direccion']
    },
    nmbEdad:{
        type: Number,
        required: [true, 'Es necesario su edad']
    },
    arrTelefonos:[
        {type: String}
    ],
    strCurp:{
        type: String,
        required: [true, 'Es necesario su Curp']
    },
    strPais:{
        type: String,
        required: [true, 'Es necesario su pais']
    },
    strCorreo:{
        type: String,
        required: [true, 'Es necesario el Correo']
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
    collection: "persona"

})

module.exports = mongoose.model('Persona', personaSchema)