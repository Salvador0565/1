const productoModelo = require('../../Modelos/Producto/producto_Modelo');
const helper = require('../../librerias/helper')
const express = require('express')
const app = express()

//localhost:3000/api/productoZZ
app.get('/', async(req, res) => {
    try {
        if(req.query.idProdcuto) req.queryMatch._id = req.query.idProdcuto
        if(req.query.termino) req.queryMatch.$or = helper(["strNombre", "strDescripcion"], req.query.termino)

    const producto = await productoModelo.aggregate([{
        $project:{
            '_id':1,
            'strNombre':1,
            'strDescripcion':1
        }
    }])

    if(producto.length <= 0){
        res.status(404).send({
            estatus: '404',
            err: true,
            msg: 'No se encontraron productos en la base de datos',
            cont: producto
        })
    }else{
        res.status(200).send({
            estatus: '200',
            err: false,
            msg: 'Informacion obtenida correctamente',
            cont:{
                producto
            }
        })
    }
    } catch (err) {
        res.status(500).send({
            estatus: '500',
            err: true,
            msg: 'Error al obtener los productos',
            cont: {
                err: Object.keys(err).length === 0 ? err.message : err
            }
        });
    }
})

app.post('/', async(req, res)=>{
    try {
        const producto = new productoModelo(req.body)
        let err = producto.validateSync()

        if(err){
            return res.status(400).json({
                ok: false,
                resp: 400,
                msg: 'Error al instertar el producto',
                cont: err
            })
        }

        const nuevoProdcuto = await producto.save()
        if (nuevoProdcuto.length <= 0) {
            res.status(400).send({
                estatus: '400',
                err: true,
                msg: 'No se pudo registrar el producto',
                cont: {
                    nuevoProdcuto
                }
            })
        }else{
            res.status(200).send({
                estatus: '200',
                err: false,
                msg: 'Se registro correctamente el producto',
                cont: {
                    nuevoProdcuto
                }
            });
        }
    } catch (err) {
        res.status(500).send({
            estatus: '500',
            err: true,
            msg: 'Error al registrar el producto',
            cont: {
                err: Object.keys(err).length === 0 ? err.message : err
            }
        });
    }
})

app.put('/', async(req, res)=>{
    try {
        const idProducto = req.query.idProducto
        if(idProducto==''){
            return res.status(400).send({
                estatus: '400',
                err: true,
                msg: 'No se recibio un Id valido',
                cont: 0
            })
        }

        req.body._id = idProducto
        const prodcutoEncontrado = await productoModelo.findById(idProducto)
        if(!prodcutoEncontrado){
            return res.status(404).send({
                estatus: '404',
                err: true,
                mgs: 'No se encontro el producto en la base de Datos',
                cont: prodcutoEncontrado
            })
        }

        const newProducto = new productoModelo(req.body);
        let err = newProducto.validateSync();
        if (err) {
            return res.status(400).json({
                ok: false,
                resp: 400,
                msg: 'No se pudo insertar el producto',
                cont: {
                    err
                }
            });
        }
    
        const productoActualizado = await productoModelo.findByIdAndUpdate(idProducto, {$set: newProducto}, {new: true})
        if(!productoActualizado){
                return res.status(404).send({
                estatus: '404',
                err: true,
                msg: 'No se pudo actualizar el producto',
                cont:{
                    err
                }
            })
        }else{
            return res.status(200).json({
                ok: false,
                resp: 200,
                msg: 'Se actualizo correctamente el producto',
                cont: productoActualizado
                    
            });
        }
        

    } catch (err) {
        res.status(500).send({
            estatus: '500',
            err: true,
            msg: 'Error al actualizar el producto',
            cont: {
                err: Object.keys(err).length === 0 ? err.message : err
            }
        });
    }
})

app.delete('/', async(req, res)=>{
    try {
        if(req.query.idProducto==''){
            return res.status(400).send({
                estatus: '400',
                err: true,
                msg: 'No se recibio un Id valido...buto',
                cont: 0
            })
        }

        idProducto = req.query.idProducto
        blnActivo = req.body.blnActivo

        const productoEncontrado = await productoModelo.findById(idProducto)
        if(!productoEncontrado){
            return res.status(404).send({
                estatus: '404',
                err: true,
                mgs: 'No se encontro el producto en la base de Datos',
                cont: productoEncontrado
            })
        }

        const productoActualizado = await productoModelo.findByIdAndUpdate(idProducto, { $set: { blnActivo } }, {new: true})
        if(!productoActualizado){
            return res.status(400).json({
                ok: false,
                reps: 400,
                msg: 'Error al elmininar al producto', 
                cont: 0
            })
        }else{
            return res.status(200).json({
                ok:false,
                resp: 200,
                msg: `Se ${blnActivo === 'true'?'activo': 'borro'} correctamente el producto`,
                cont: productoActualizado
            })
        }
    } catch (err) {
        res.status(500).send({
            estatus: '500',
            err: true,
            msg: 'Error al eliminar el producto.',
            cont: {
                err: Object.keys(err).length === 0 ? err.message : err
            }
        });
    }
})
module.exports = app