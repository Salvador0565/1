const express = require('express')
const app = express()

app.use('/persona', require('./Persona/persona'))
app.use('/proveedor', require('./Proveedor/proveedor'))
app.use('/almacen', require('./Proveedor/ajsnAlmacen'))
app.use('/producto', require('./Producto/producto'))
app.use('/tienda', require('./Tienda/tienda'))
app.use('/venta', require('./Tienda/ajsnVenta'))
app.use('/inventario', require('./Tienda/ajsnInventario'))

module.exports = app