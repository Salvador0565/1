const tiendaModelo = require('../../Modelos/Tienda/tienda_Modelo');
const ventaModelo = require('../../Modelos/Tienda/ajsnVenta_Modelo');
const helper = require('../../librerias/helper')
const express = require('express')
const app = express()

//localhost:3000/api/venta
app.get('/', async(req, res)=>{
    try {
        let idVenta =''
        const idTienda = req.query.idTienda

        if(req.query.idVenta){
            idVenta = req.query.idVenta
        }

        let queryFind = {}
        let queryOptions = {}

        if(idVenta){
            queryFind = {
                '_id': idTienda,
                'ajsnVenta':{
                    $elematch: {
                        '_id': idVenta
                    }
                }
            }

            queryOptions = {'ajsnVenta': 1}
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

        const venta = await tiendaModelo.find({queryFind, queryOptions})
        if (venta.length <= 0) {
            res.status(404).send({
                estatus: '404',
                err: true,
                msg: 'No se encontraron tiendas en la base de datos',
                cont: {
                    venta
                }
            })
        } else {
            res.status(200).send({
                estatus: '200',
                err: false,
                msg: 'Informacion obtenida correctamente.',
                cont: {
                    venta
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
                msg: 'id No valido',
                cont: 0
            })
        }

        const venta = new ventaModelo(req.body);
        let err = venta.validateSync()
        if (err) {
            return res.status(400).json({
                ok: false,
                resp: 400,
                msg: 'Error al Insertar una venta',
                cont: {
                    err
                }
            }) 
        }

        const nuevaVenta = await tiendaModelo.findByIdAndUpdate(idTienda, {$push:{'ajsnVenta': venta}},{new: true})
        if (nuevaVenta.length <= 0) {
            res.status(400).send({
                estatus: '400',
                err: true,
                msg: 'No se pudo registrar la venta en la base de datos.',
                cont: 0
            })
        }else {
            res.status(200).send({
                estatus: '200',
                err: false,
                msg: 'Informacion insertada correctamente.',
                cont: {
                    venta
                }
            });
        }
    } catch (error) {
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
        const idVenta = req.query.idVenta
        if (idTienda == undefined || idVenta == undefined) {
            return res.status(400).send({
                estatus: '400',
                err: true,
                msg: 'Ids invalidos',
                cont: 0
            })
        }

        req.body._id = idVenta
        const venta = new ventaModelo(req.body)
        let err = venta.validateSync()

        if (err) {
            return res.status(400).json({
                ok: false,
                resp: 400,
                msg: 'Error al actualizar la venta.',
                cont: {
                    err
                }
            })
        }

        const nuevaVenta = await tiendaModelo.findOneAndUpdate({ '_id': idTienda, 'ajsnVenta._id': idVenta }, { $set: { 'ajsnVenta.$[i]': venta } }, { arrayFilters: [{ 'i._id': idVenta }], new: true });
        if (nuevaVenta.length <= 0) {
            res.status(400).send({
                estatus: '400',
                err: true,
                msg: 'No se pudo actualizar la venta en la base de datos.',
                cont: 0
            });
        } else {
            res.status(200).send({
                estatus: '200',
                err: false,
                msg: 'Informacion actualizada correctamente.',
                cont: {
                    venta
                }
            })
        }
    } catch (err) {
        res.status(500).send({
            estatus: '500',
            err: true,
            msg: 'Error al actualizar la venta.',
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
        const idVenta= req.query.idVenta

        if(idTienda== undefined || idVenta==undefined){
            res.status(404).send({
                estatus: '404',
                err: true,
                msg: 'No se encontraron tiendas o ventas en la base de datos.',
                cont: 0
            });
        }

        const nuevaVenta = await tiendaModelo.findOneAndUpdate({'_id': idTienda, 'ajsnVenta._id': idVenta},{$set: {'ajsnVenta.$.blnActivo': blnActivo}}, {new: true})
        if (nuevaVenta.length <= 0) {
            res.status(400).send({
                estatus: '400',
                err: true,
                msg: 'No se pudo borrar la venta en la base de datos.',
                cont: nuevaVenta
            });
        } else {
            res.status(200).send({
                estatus: '200',
                err: false,
                msg: `Se ${blnActivo === 'true'? 'activo' : 'borro'} correctamente la venta`,
                cont: {
                    nuevaVenta
                }
            });
        }

    } catch (err) {
        res.status(500).send({
            estatus: '500',
            err: true,
            msg: 'Error al eliminar la venta',
            cont: {
                err: Object.keys(err).length === 0 ? err.message : err
            }
        });
    }
})

module.exports = app