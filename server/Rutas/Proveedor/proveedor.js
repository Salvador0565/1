const proveedorModelo = require('../../Modelos/Proveedor/proveedor_Modelo')
const tiendaModelo = require('../../Modelos/Tienda/tienda_Modelo')
const helper = require('../../librerias/helper')
const express = require('express')
const db = require('mongoose')
const app = express()

//localhost:3000/api/proveedor
app.get('/', async(req, res)=>{
    try {
        if (req.query.idProovedor) req.queryMatch._id = req.query.idProovedor;
        if (req.query.termino) req.queryMatch.$or = Helper(["strEmpresa", "strDireccionEmpresa"], req.query.termino);

        const proveedor = await proveedorModelo.aggregate([
            {
                $lookup: {
                    from: 'producto',
                    localField: 'ajsnAlmacen.idProducto',
                    foreignField: '_id',
                    as: 'productosAlamcenados'
                }
            },
            {
              $lookup:{
                  from:'persona',
                  localField: 'idPersona',
                  foreignField: '_id',
                  as: 'personas'
              }  
            },
            {
                $project:{
                '_id':1,
                'strEmpresa':1,
                'strDireccionEmpresa':1,
                'personas': 1,
                'ajsnAlmacen':{
                    $map:{
                        input:'$ajsnAlmacen',
                        as: 'almacen',
                        in:{
                            '_id':'$$almacen._id',
                            'producto':{
                                $arrayElemAt:[{
                                    $filter:{
                                        input:'$productosAlamcenados',
                                        as: 'producto',
                                        cond:{
                                            $eq:['$$almacen.idProducto', '$$producto._id']
                                        }
                                }},0]
                            }
                        }
                    }
                }
            }
            }
        ])
        if (proveedor.length <= 0) {
            res.status(404).send({
                estatus: '404',
                err: true,
                msg: 'No se encontraron proveedores en la base de datos.',
                cont: {
                    proveedor
                }
            });
        }else {
            res.status(200).send({
                estatus: '200',
                err: false,
                msg: 'Informacion obtenida correctamente.',
                cont: {
                    proveedor
                }
            });
        }
    } catch (err) {
        res.status(500).send({
            estatus: '500',
            err: true,
            msg: 'Error al obtener a los proveedores',
            cont: {
                err: Object.keys(err).length === 0 ? err.message : err
            }
        });
    }
})

app.post('/', async(req, res)=>{
    try {
        const proveedor = new proveedorModelo(req.body)
        let err = proveedor.validateSync()

        if (err) {
            return res.status(400).json({
                ok: false,
                resp: 400,
                msg: 'Error al Insertar un proveedor',
                cont: {
                    err
                }
            })
        }

        const prodcutoEncontrado = await proveedorModelo.findOne({ strEmpresa: { $regex: `^${proveedor .strEmpresa}$`, $options: 'i' } });
        if (prodcutoEncontrado) return res.status(400).json({
            ok: false,
            resp: 400,
            msg: `Ya esta en uso el/la${proveedor .strEmpresa}`,
            cont: 0
        })

        const nuevoProveedor = await proveedor.save();
        if (nuevoProveedor.length <= 0) {
            res.status(400).send({
                estatus: '400',
                err: true,
                msg: 'No se pudo registrar el proveedor en la base de datos.',
                cont: {
                    nuevoProveedor
                }
            })
        }else{
            res.status(200).send({
                estatus: '200',
                err: false,
                msg: 'Informacion insertada correctamente.',
                cont: {
                    nuevoProveedor
                }
            })
        }
    } catch (err) {
        res.status(500).send({
            estatus: '500',
            err: true,
            msg: 'Error al registrar el proveedor',
            cont: {
                err: Object.keys(err).length === 0 ? err.message : err
            }
        });
    }
})

app.put('/', async(req, res)=>{
    try {
        const idProveedor = req.query.idProveedor
        if(req.query.idProveedor == ''){
            return res.status(400).send({
                estatus: '400',
                err: true,
                msg: 'No se recibio un Id valido',
                cont: proveedorEncontrado
            })
        }

        req.body._id = idProveedor

        const proveedorEncontrado = await proveedorModelo.findById(idProveedor)

        if(!proveedorEncontrado){
            return res.status(404).send({
                estatus: '404',
                err: true,
                msg: 'No se encontro el proveedor necesitada',
                cont: proveedorEncontrado
            })
        }
        const newProveedor = new proveedorModelo(req.body);

        let err = newProveedor.validateSync();

        if (err) {
            return res.status(400).json({
                ok: false,
                resp: 400,
                msg: 'Error al actualizar el proveedor.',
                cont: {
                    err
                }
            });
        }
        const proveedorActualizado = await proveedorModelo.findByIdAndUpdate(idProveedor, {$set: newProveedor}, {new: true})
        if(!proveedorActualizado){
            return res.status(400).json({
                ok: false,
                resp: 400,
                msg: 'Error al actualizar el proveedor... pero ahora si el prron',
                cont: {
                    err
                }
            });
        }else{
            return res.status(200).json({
                ok: false,
                resp: 200,
                msg: 'Se actualizo correctamente el proveedor prieto',
                cont: proveedorActualizado
                
            });
        }
    } catch (err) {
        res.status(500).send({
            estatus: '500',
            err: true,
            msg: 'Error fatal al actualizar el proveedor',
            cont: {
                err: Object.keys(err).length === 0 ? err.message : err
            }
        });
    }
})

app.delete('/', async(req, res)=>{
    try {

        if(req.query.idProveedor == ''){
            return res.status(400).send({
                estatus: '400',
                err: true,
                msg: 'No se recibio un Id valido',
                cont: proveedorEncontrado
            })
        }

        idProveedor = req.query.idProveedor;
        blnActivo = req.body.blnActivo;

        const proveedorEncontrado = await proveedorModelo.findById(idProveedor)

        if(!proveedorEncontrado){
            return res.status(404).send({
                estatus: '404',
                err: true,
                msg: 'No se encontro el proveedor necesitado',
                cont: proveedorEncontrado
            })
        }

        const proveedorActualizado = await proveedorModelo.findByIdAndUpdate(idProveedor, { $set: { blnActivo } }, {new: true})

        if(!proveedorActualizado){
            return res.status(400).json({
                ok: false,
                resp: 400,
                msg: 'No se pudo eliminar el proveedor',
                cont: {
                    err
                }
            });
        }else{
            return res.status(200).json({
                ok: false,
                resp: 200,
                msg: `Se ${blnActivo === 'true'? 'activo' : 'borro'} correctamente el proveedor`,
                cont: proveedorActualizado
                
            });
        }

    } catch (err) {
        res.status(500).send({
            estatus: '500',
            err: true,
            msg: 'Error al eliminar al proveedor',
            cont: {
                err: Object.keys(err).length === 0 ? err.message : err
            }
        });
    }
})

app.patch('/', async(req, res)=>{
    const sesion = await db.startSession()
    try {
        const proveedor = new proveedorModelo(req.body)
        let err = proveedor.validateSync()

        if (err) {
            return res.status(400).json({
                ok: false,
                resp: 400,
                msg: 'Oscurrio un error al Insertar un proveedor',
                cont: {
                    err
                }
            })
        }

        const resultTrans = await sesion.withTransaction(async ()=>{
            await proveedorModelo.create([proveedor],{sesion:sesion})
        })

        if(resultTrans){
            const provTien = await tiendaModelo.updateMany({},{$push:{'arrProveedores': proveedor._id}})
            if(!provTien){
                return res.status(400).json({
                    ok: false,
                    resp: 400,
                    msg: 'Error al Insertar un proveedor',
                    cont: 0
                })
            }
        }else{
            res.status(200).send({
                estatus: '200',
                err: false,
                msg: 'Informacion insertada correctamente.',
                cont: {
                    proveedor
                }
            })
        }
        
    } catch (err) {
        res.status(500).send({
            estatus: '500',
            err: true,
            msg: 'Error fatal destructivo magistral al actualizar el proveedor',
            cont: {
                err: Object.keys(err).length === 0 ? err.message : err
            }
        });
    }
    finally{
        sesion.endSession()
    }
})
module.exports = app