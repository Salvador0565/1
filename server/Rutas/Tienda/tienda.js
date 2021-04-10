const tiendaModelo = require('../../Modelos/Tienda/tienda_Modelo')
const helper = require('../../librerias/helper')
const express = require('express')
const app = express()

//localhost:3000/api/tienda
app.get('/', async(req, res)=>{
    try {
        if (req.query.idTienda) req.queryMatch._id = req.query.idTienda
        if (req.query.termino) req.queryMatch.$or = helper(["strNombre", "strDireccion", "strUrlWeb"], req.query.termino)

        const tienda = await tiendaModelo.aggregate([
            {
              $lookup:{
                  from: 'persona',
                  localField: 'ajsnVenta.idPersona',
                  foreignField: '_id',
                  as: 'personaVenta'
              }  
            },
            {
                $lookup:{
                  from:'producto',
                  localField: 'ajsnInventario.idProducto',
                  foreignField: '_id',
                  as: 'productoInventario'
              }
            },
            {
              $lookup:{
                  from:'producto',
                  localField: 'ajsnVenta.idProducto',
                  foreignField: '_id',
                  as: 'productoVendido'
              }  
            },
            {
            $project:{
                'id':1,
                'strNombre': 1,
                'strDireccion':1,
                'strUrlWeb':1,
                'strTelefono':1,
                'arrProveedores':1,
                'arrSucursales':1,
                'Inventario':{
                    $map:{
                        input: '$ajsnInventario',
                        as: 'inventario',
                        in:{
                            '_id':'$$inventario._id',
                            'productoAlmacenado':{
                                $arrayElemAt:[{
                                    $filter:{
                                        input:'$productoInventario',
                                        as: 'producto',
                                        cond:{
                                            $eq:['$$inventario.idProducto','$$producto._id']
                                        }
                                    }
                                },0]
                            }
                        }
                    }
                },
                'Venta':{
                    $map:{
                        input: '$ajsnVenta',
                        as: 'venta',
                        in:{
                            '_id':'$$venta._id',
                            'personas':{
                                $arrayElemAt:[{
                                    $filter:{
                                        input:'$personaVenta',
                                        as: 'persona',
                                        cond:{
                                            $eq:['$$venta.idPersona','$$persona._id']
                                        }
                                        
                                    }
                                },0]
                            },
                            'producto':{
                                $arrayElemAt:[{
                                    $filter:{
                                        input:'$productoVendido',
                                        as: 'producto',
                                        cond:{
                                            $eq:['$$venta.idProducto','$$producto._id']
                                        }
                                        
                                    }
                                },0]
                            },
                            'PrecioTotal':'$$venta.nmbTotalPrecio',
                            'Cantidad':'$$venta.nmbCantidad',
                            'MetodoDePago': '$$venta.strMetodoPago'
                        }
                    }
                }
            }
        },
        ])

        if (tienda.length <= 0) {
            res.status(404).send({
                estatus: '404',
                err: true,
                msg: 'No se encontraron tiendas en la base de datos.',
                cont: {
                    tienda
                }
            })
        }else {
            res.status(200).send({
                estatus: '200',
                err: false,
                msg: 'Informacion obtenida correctamente.',
                cont: {
                    tienda
                }
            });
        }
    } catch (err) {
        res.status(500).send({
            estatus: '500',
            err: true,
            msg: 'Error al obtener las tiendas',
            cont: {
                err: Object.keys(err).length === 0 ? err.message : err
            }
        });
    }
})

app.post('/', async(req, res)=>{
    try {
        const tienda = new tiendaModelo(req.body)
        let err = tienda.validateSync()
        if (err) {
            return res.status(400).json({
                ok: false,
                resp: 400,
                msg: 'Error al Insertar la tienda.',
                cont: {
                    err
                }
            })
        }

        const tiendaEncontrada = await tiendaModelo.findOne({ strDireccion: { $regex: `^${tienda.strDireccion}$`, $options: 'i' } })
        if (tiendaEncontrada) return res.status(400).json({
            ok: false,
            resp: 400,
            msg: `La tienda que se desea insertar con la direccion ${tienda.strDireccion} ya se encuentra registrada en la base de datos.`,
            cont: 0
        })

        const nuevaTienda = await tienda.save()
        if (nuevaTienda.length <= 0) {
            res.status(400).send({
                estatus: '400',
                err: true,
                msg: 'No se pudo registrar la tienda en la base de datos.',
                cont: {
                    nuevaTienda
                }
            });
        } else {
            res.status(200).send({
                estatus: '200',
                err: false,
                msg: 'Informacion insertada correctamente.',
                cont: {
                    nuevaTienda
                }
            })
        }
    } catch (err) {
        res.status(500).send({
            estatus: '500',
            err: true,
            msg: 'Error al registrar la tienda.',
            cont: {
                err: Object.keys(err).length === 0 ? err.message : err
            }
        })
    }
})

app.put('/', async(req, res)=>{
    try {
        const idTienda = req.query.idTienda
        if (idTienda == '') {
            return res.status(400).send({
                estatus: '400',
                err: true,
                msg: 'No se envio un id valido.',
                cont: 0
            });
        }

        req.body._id = idTienda
        const tiendaEncontrada = await tiendaModelo.findById(idTienda)
        if (!tiendaEncontrada){
            return res.status(404).send({
                estatus: '404',
                err: true,
                msg: 'No se encontro la persona en la base de datos.',
                cont: tiendaEncontrada
            })
        }
        
        const newTienda = new tiendaModelo(req.body)
        let err = newTienda.validateSync()
        if (err) {
            return res.status(400).json({
                ok: false,
                resp: 400,
                msg: 'Error al actualizar la tienda.',
                cont: {
                    err
                }
            })
        }

        const tiendaActualizada = await tiendaModelo.findByIdAndUpdate(idTienda, { $set: {strNombre: newTienda.strNombre, strDireccion: newTienda.strDireccion, strTelefono: newTienda.strTelefono, strUrlWeb: newTienda.strUrlWeb}, $push:{arrSucursales: newTienda.arrSucursales, arrProveedores: newTienda.arrProveedores}}, { new: true })
        if (!tiendaActualizada) {
            return res.status(400).json({
                ok: false,
                resp: 400,
                msg: 'No se pudo actualizar la tienda.',
                cont: 0
            })
        } else {
            return res.status(200).json({
                ok: true,
                resp: 200,
                msg: 'Se actualizo la tienda correctamente.',
                cont: {
                    tiendaActualizada
                }
            })
        }
    } catch (err) {
        res.status(500).send({
            estatus: '500',
            err: true,
            msg: 'Error al actualizar la tienda.',
            cont: {
                err: Object.keys(err).length === 0 ? err.message : err
            }
        })
    }
})

app.delete('/', async(req, res) => {

    try {

        if (req.query.idTienda == '') {
            return res.status(400).send({
                estatus: '400',
                err: true,
                msg: 'No se envio un id valido.',
                cont: 0
            });
        }

        idTienda = req.query.idTienda;
        blnActivo = req.body.blnActivo;

        const tiendaEncontrada = await tiendaModelo.findById(idTienda);

        if (!tiendaEncontrada)
            return res.status(404).send({
                estatus: '404',
                err: true,
                msg: 'No se encontro la tienda en la base de datos.',
                cont: tiendaEncontrada
            });

        const tiendaActualizada = await tiendaModelo.findByIdAndUpdate(idTienda, { $set: { blnActivo } }, { new: true });

        if (!tiendaActualizada) {
            return res.status(400).json({
                ok: false,
                resp: 400,
                msg: 'Error al intentar eliminar la tienda.',
                cont: 0
            });
        } else {
            return res.status(200).json({
                ok: true,
                resp: 200,
                msg: `Se a ${blnActivo === 'true'? 'activado': 'desactivado'} la tienda correctamente.`,
                cont: {
                    tiendaActualizada
                }
            });
        }


    } catch (err) {
        res.status(500).send({
            estatus: '500',
            err: true,
            msg: 'Error al eliminar a la tienda',
            cont: {
                err: Object.keys(err).length === 0 ? err.message : err
            }
        });
    }

})

module.exports = app