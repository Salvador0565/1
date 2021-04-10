const tiendaModelo = require('../../Modelos/Tienda/tienda_Modelo');
const inventarioModelo = require('../../Modelos/Tienda/ajsnIneventario_Modelo');
const helper = require('../../librerias/helper')
const express = require('express')
const app = express()

//localhost:3000/api/inventario
app.get('/', async(req, res)=>{
    try {
        let idInventario =''
        const idTienda = req.query.idTienda

        if(req.query.idInventario){
            idInventario = req.query.idInventario
        }

        let queryFind = {}
        let queryOptions = {}

        if(idInventario){
            queryFind = {
                '_id': idTienda,
                'ajsnIenventario':{
                    $elematch: {
                        '_id': idInventario
                    }
                }
            }

            queryOptions = {'ajsnInventario': 1}
        }else{
            queryFind={
                '_id': idTienda
            }
            queryOptions={}
        }

        if(idTienda==undefined){
            res.status(404).send({
                estatus: '404',
                err: true,
                msg: 'No se recibio un id valido',
                cont: 0
            })
        }

        const ineventario = await tiendaModelo.find({queryFind, queryOptions})
        if (ineventario.length <= 0) {
            res.status(404).send({
                estatus: '404',
                err: true,
                msg: 'No se encontraron tiendas en la base de datos',
                cont: {
                    ineventario
                }
            })
        } else {
            res.status(200).send({
                estatus: '200',
                err: false,
                msg: 'Informacion obtenida correctamente.',
                cont: {
                    ineventario
                }
            })
        }
    } catch (err) {
        res.status(500).send({
            estatus: '500',
            err: true,
            msg: 'Error al obtener las ventas',
            cont: {
                err: Object.keys(err).length === 0 ? err.message : err
            }
        })
    }
})

app.post('/', async(req, res)=>{
    try {
        const idTienda = req.query.idTienda
        if(idTienda== undefined){
            res.status(404).send({
                estatus: '404',
                err: true,
                msg: 'No se recibio un Id valido',
                cont: 0
            })
        }

        const inventario = new inventarioModelo(req.body);
        let err = inventario.validateSync()
        if (err) {
            return res.status(400).json({
                ok: false,
                resp: 400,
                msg: 'Error al Insertar un reporte de inventario',
                cont: {
                    err
                }
            }) 
        }

        const nuevoInventario= await tiendaModelo.findByIdAndUpdate(idTienda, {$push:{'ajsnInventario': inventario}},{new: true})
        if (nuevoInventario.length <= 0) {
            res.status(400).send({
                estatus: '400',
                err: true,
                msg: 'No se pudo registrar el reporte de inventario',
                cont: 0
            })
        }else {
            res.status(200).send({
                estatus: '200',
                err: false,
                msg: 'Informacion insertada correctamente.',
                cont: {
                    inventario
                }
            })
        }
    } catch (err) {
        res.status(500).send({
            estatus: '500',
            err: true,
            msg: 'Error al registrar la venta',
            cont: {
                err: Object.keys(err).length === 0 ? err.message : err
            }
        })
    }
})

app.put('/', async(req, res)=>{
    try {
        const idTienda = req.query.idTienda
        const idInventario = req.query.idInventario
        if (idTienda == undefined || idInventario == undefined) {
            return res.status(400).send({
                estatus: '400',
                err: true,
                msg: 'Ids invalidos',
                cont: 0
            })
        }

        req.body._id = idInventario
        const inventario = new ventaModelo(req.body)
        let err = inventario.validateSync()
        if (err) {
            return res.status(400).json({
                ok: false,
                resp: 400,
                msg: 'Error al actualizar el inventario',
                cont: {
                    err
                }
            })
        }
        const nuevoInventario = await tiendaModelo.findOneAndUpdate({ '_id': idTienda, 'ajsnInventario._id': idInventario }, { $set: { 'ajsnInventario.$[i]': venta } }, { arrayFilters: [{ 'i._id': idInventario }], new: true });
        if (nuevoInventario.length <= 0) {
            res.status(400).send({
                estatus: '400',
                err: true,
                msg: 'No se pudo actualizar el inventario en la base de datos.',
                cont: 0
            });
        } else {
            res.status(200).send({
                estatus: '200',
                err: false,
                msg: 'Informacion actualizada correctamente.',
                cont: {
                    inventario
                }
            })
        }
    } catch (err) {
        res.status(500).send({
            estatus: '500',
            err: true,
            msg: 'Error al actualizar el inventario',
            cont: {
                err: Object.keys(err).length === 0 ? err.message : err
            }
        })
    }
})

app.delete('/', async(req, res)=>{
    try {
        const idTienda = req.query.idTienda
        const blnActivo =req.body.blnActivo
        const idInventario= req.query.idInventario

        if(idTienda== undefined || idInventario==undefined){
            res.status(404).send({
                estatus: '404',
                err: true,
                msg: 'No se encontraron tiendas o ventas en la base de datos.',
                cont: 0
            });
        }

        const nuevoInventario = await tiendaModelo.findOneAndUpdate({'_id': idTienda, 'ajsnInventario._id': idInventario},{$set: {'ajsnInventario.$.blnActivo': blnActivo}}, {new: true})
        if (nuevoInventario.length <= 0) {
            res.status(400).send({
                estatus: '400',
                err: true,
                msg: 'No se pudo borrar la venta en la base de datos.',
                cont: nuevoInventario
            });
        } else {
            res.status(200).send({
                estatus: '200',
                err: false,
                msg: `Se ${blnActivo === 'true'? 'activo' : 'borro'} correctamente la venta`,
                cont: {
                    nuevoInventario
                }
            });
        }

    } catch (err) {
        res.status(500).send({
            estatus: '500',
            err: true,
            msg: 'Error al eliminar',
            cont: {
                err: Object.keys(err).length === 0 ? err.message : err
            }
        });
    }
})
module.exports = app