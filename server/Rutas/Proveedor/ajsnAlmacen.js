const proveedorModelo = require('../../Modelos/Proveedor/proveedor_Modelo');
const almacenModelo = require('../../Modelos/Proveedor/ajsnAlmacen_Modelo');
const helper = require('../../librerias/helper')
const express = require('express')
const app = express()

//localhost:3000/api/almacen
app.get('/', async(req, res)=>{
    try {
        
        let idAlmacen =''
        const idProveedor = req.query.idProveedor

        if(req.query.idAlmacen){
            idAlmacen = req.query.idAlmacen
        }

        let queryFind = {}
        let queryOptions = {}

        if(idAlmacen){
            queryFind = {
                '_id': idProveedor,
                'ajsnAlmacen':{
                    $elematch: {
                        '_id': idAlmacen
                    }
                }
            }

            queryOptions = {'ajsnAlmacen': 1}
        }else{
            queryFind={
                '_id': idProveedor
            }
            queryOptions={}
        }

        if(idProveedor==undefined){
            res.status(404).send({
                estatus: '404',
                err: true,
                msg: 'No se recibio un Id valido',
                cont: 0
            })
        }

        const proveedor = await proveedorModelo.find({queryFind, queryOptions});
        if (proveedor.length <= 0) {
            res.status(404).send({
                estatus: '404',
                err: true,
                msg: 'No se encontraron proveedores en la base de datos prrones.',
                cont: {
                    proveedor
                }
            })
        } else {
            res.status(200).send({
                estatus: '200',
                err: false,
                msg: 'Informacion obtenida correctamente.',
                cont: {
                    proveedor
                }
            })
        }
    } catch (err) {
        res.status(500).send({
            estatus: '500',
            err: true,
            msg: 'Error al obtener las proveedores.',
            cont: {
                err: Object.keys(err).length === 0 ? err.message : err
            }
        })
    }
})

app.post('/', async(req, res)=>{
    try {
        const idProveedor = req.query.idProveedor
        if(idProveedor== undefined){
            res.status(404).send({
                estatus: '404',
                err: true,
                msg: 'No se encontraron proveedores en la base de datos.',
                cont: 0
            })
        }
        const almacen = new almacenModelo(req.body);
        let err = almacen.validateSync()
        if (err) {
            return res.status(400).json({
                ok: false,
                resp: 400,
                msg: 'Error al Insertar un reporte de almacen.',
                cont: {
                    err
                }
            }) 
        }

        const nuevoAlmacen = await proveedorModelo.findByIdAndUpdate(idProveedor,{$push:{'ajsnAlmacen': almacen}},{new: true})
        if (nuevoAlmacen.length <= 0) {
            res.status(400).send({
                estatus: '400',
                err: true,
                msg: 'No se pudo registrar el reporte del almacen en la base de datos.',
                cont: 0
            })
        }else {
            res.status(200).send({
                estatus: '200',
                err: false,
                msg: 'Informacion insertada correctamente.',
                cont: {
                    almacen
                }
            });
        }
    }catch (err) {
        res.status(500).send({
            estatus: '500',
            err: true,
            msg: 'Error al registrar el reporte del almacen.',
            cont: {
                err: Object.keys(err).length === 0 ? err.message : err
            }
        })
    }
})

app.put('/', async(req, res)=>{
    try {
        const idProveedor = req.query.idProveedor
        const idAlmacen = req.query.idAlmacen

        if(idProveedor== undefined || idAlmacen==undefined){
            res.status(404).send({
                estatus: '404',
                err: true,
                msg: 'Ids invalidos',
                cont: 0
            });
        }

        req.body._id = idAlmacen
        const almacen = new almacenModelo(req.body);
        let err = almacen.validateSync();
        if (err) {
            return res.status(400).json({
                ok: false,
                resp: 400,
                msg: 'Error al Insertar un reporte de almacen.',
                cont: {
                    err
                }
            }); 
        }

        const nuevoAlmacen = await proveedorModelo.findOneAndUpdate({'_id': idProveedor, 'ajsnAlmacen._id': idAlmacen},{$set: {'ajsnAlmacen.$[i]': almacen}},{arryFilters:[{'i._id': idAlmacen}], new: true})
        if (nuevoAlmacen.length <= 0) {
            res.status(400).send({
                estatus: '400',
                err: true,
                msg: 'No se pudo actualizar el reporte del almacen en la base de datos.',
                cont: 0
            })
        }else {
            res.status(200).send({
                estatus: '200',
                err: false,
                msg: 'Informacion actualizada correctamente.',
                cont: {
                    almacen
                }
            });
        }
        
    } catch (err) {
        res.status(500).send({
            estatus: '500',
            err: true,
            msg: 'Error al actualizar el almacen.',
            cont: {
                err: Object.keys(err).length === 0 ? err.message : err
            }
            
        });
        
    }
})

app.delete('/', async(req, res)=>{
    try {
        const idProveedor = req.query.idProveedor
        const blnActivo =req.body.blnActivo
        const idAlmacen = req.query.idAlmacen

        if(idProveedor== undefined || idAlmacen==undefined){
            res.status(404).send({
                estatus: '404',
                err: true,
                msg: 'No se encontraron proveedores o almacenes en la base de datos.',
                cont: 0
            });
        }

        const nuevoAlmacen = await proveedorModelo.findOneAndUpdate({'_id': idProveedor, 'ajsnAlmacen._id': idAlmacen},{$set: {'ajsnAlmacen.$.blnActivo': blnActivo}}, {new: true})

        if (nuevoAlmacen.length <= 0) {
            res.status(400).send({
                estatus: '400',
                err: true,
                msg: 'No se pudo borrar el reporte de almacen en la base de datos.',
                cont: nuevoAlmacen
            });
        } else {
            res.status(200).send({
                estatus: '200',
                err: false,
                msg: `Se ${blnActivo === 'true'? 'activo' : 'borro'} correctamente el reporte de almacen `,
                cont: {
                    nuevoAlmacen
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
module.exports = app;