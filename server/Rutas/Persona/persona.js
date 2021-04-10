const personaModelo = require('../../Modelos/Persona/persona_Modelo')
const helper = require('../../librerias/helper')
const express = require('express')
const app = express()

//localhost:3000/api/persona
app.get('/', async(req, res)=>{
    try {
        if(req.query.idPersona) req.queryMatch._id = req.query.idPersona
        if(req.query.termino) req.queryMatch.$or = helper(["strNombre", "srtCurp", "strCorreo"], req.query.termino)

        const persona = await personaModelo.aggregate([{
            $project:{
                '_id':1,
                'strNombre':1,
                'strApellidos':1,
                'strCorreo':1,
                'nmbEdad': 1,
                'arrTelefonos':1
            }
        }])

        if(persona.length <= 0){
            res.status(404).send({
                estatus: '404',
                err: true,
                msg: 'No se encontraron esta persona en la base de datos',
                cont: persona
            })
        }else{
            res.status(200).send({
                estatus: '200',
                err: false,
                msg: 'Informacion obtenida correctamente',
                cont:{
                    persona
                }
            })
        }
    } catch (err) {
        res.status(500).send({
            estatus: '500',
            err: true,
            msg: 'Error al obtener a las personas.',
            cont: {
                err: Object.keys(err).length === 0 ? err.message : err
            }
        });
    }
})

app.post('/', async(req, res)=>{
    try {
        const persona = new personaModelo(req.body)
        let err = persona.validateSync()

        if(err){
            return res.status(400).json({
                ok: false,
                resp: 400,
                msg: 'Error al instertar a la persona',
                cont: err
            })
        }

        const personaEncontrada = await personaModelo.findOne({strCorreo: {$regex: `^${persona.strCorreo}$`}})
        if(personaEncontrada){
            return res.status(400).json({
                ok:false,
                resp: 400,
                msg: 'El correo que desea registrar ya esta ocupado',
                cont: {
                    Correo: personaEncontrada.strCorreo
                }
            })
        }

        const personaRegistrada = await persona.save()
        if(personaRegistrada.length <=0){
            res.status(400).send({
                estatus: '400',
                err: true,
                msg:' No se pudo registrar a la persona en la base de datos'
            })
        }else{
            res.status(200).send({
                estatus: '200',
                err: false,
                msg: 'Persona insertada correctamente',
                cont: personaRegistrada
            })
        }
    } catch (err) {
        res.status(500).send({
            estatus: '500',
            err: true,
            msg: 'Error al insertar a la persona',
            cont: {
                err: Object.keys(err).length === 0 ? err.message : err
            }
        })
    } 
})

app.put('/', async(req, res)=>{
    try {
        const idPersona = req.query.idPersona
        if(req.query.idPersona==''){
            return res.status(400).send({
                estatus: '400',
                err: true,
                msg:'No se recibio un Id valido',
                cont: 0
            })
        }

        req.body._id = idPersona
        const personaEncontrada = await personaModelo.findById(idPersona)
        if(!personaEncontrada){
            return res.status(404).send({
                estatus: '404',
                err: true,
                mgs: 'No se encontro la persona en la base de Datos',
                cont: personaEncontrada
            })
        }

        const newPersona = new personaModelo(req.body)
        let err = newPersona.validateSync()

        if(err){
            return res.status(400).json({
                ok: false,
                resp: 400,
                msg: 'Error al insertar la persona'
            })
        }

        
        const personaActualizada = await personaModelo.findByIdAndUpdate(idPersona, {$set:{strNombre: newPersona.strNombre, strApellidos: newPersona.strApellidos, strDirecion: newPersona.strDirecion, nmbEdad: newPersona.nmbEdad, strCurp: newPersona.strCurp, strPais: newPersona.strPais, strCorreo: newPersona.strCorreo}, $push: {arrTelefonos: newPersona.arrTelefonos}},{new:true})
        if(!personaActualizada){
            return res.status(400).json({
                ok:false,
                resp: 400,
                msg: 'Oscurrio un error al actualizar a la parsona',
                cont: err
            })
        }else{
            return res.status(200).json({
                ok:false,
                resp:200,
                msg: 'Se actualizo correctamente la persona',
                cont: personaActualizada
            })
        }
    } catch (err) {
        res.status(500).send({
            estatus: '500',
            err: true,
            msg: 'Error al actualizar persona',
            cont: {
                err: Object.keys(err).length === 0 ? err.message : err
            }
        });
    }
}) 

app.delete('/', async(req, res)=>{
    try {
        if(req.query.idPersona==''){
            return res.status(400).send({
                estatus: '400',
                err: true,
                msg: 'No se recibio un Id valido...buto',
                cont: 0
            })
        }

        idPersona = req.query.idPersona
        blnActivo = req.body.blnActivo

        const personaEncontrada = await personaModelo.findById(idPersona)
        if(!personaEncontrada){
            return res.status(404).send({
                estatus: '404',
                err: true,
                mgs: 'No se encontro la persona en la base de Datos',
                cont: personaEncontrada
            })
        }

        const personaActualizada = await personaModelo.findByIdAndUpdate(idPersona, { $set: { blnActivo } }, {new: true})
        if(!personaActualizada){
            return res.status(400).json({
                ok: false,
                reps: 400,
                msg: 'Error al elmininar a la persona', 
                cont: 0
            })
        }else{
            return res.status(200).json({
                ok:false,
                resp: 200,
                msg: `Se ${blnActivo === 'true'?'activo': 'borro'} correctamente la persona`,
                cont: personaActualizada
            })
        }
    } catch (err) {
        res.status(500).send({
            estatus: '500',
            err: true,
            msg: 'Error al eliminar a la persona',
            cont: {
                err: Object.keys(err).length === 0 ? err.message : err
            }
        });
    }
})
module.exports = app;