require('./config/config')

const hostname = '127.0.0.1'
const morgan = require('morgan')
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const app = express()
const opcionesGet = require('./Midlewares/opcionesGet')

app.use(cors())
app.use(bodyParser.urlencoded({extended: true}))
app.use((req, res, next)=>{
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Headers', 'Authorization, Origin, X-Requested-With, Content-Type, Accept')
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE')
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE')
    next()
})
app.use(bodyParser.json())

app.use(morgan('dev'))
app.use(opcionesGet)
app.use('/api', require('./Rutas/index'))

mongoose.connect('mongodb+srv://juan:juan123@cluster0.ackr2.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
}).then((resp)=>{
    console.log(`Base de datos conectada en ${process.env.URLDB} `)
}).catch((err)=>{
    console.log(`Error: No se pudo conectar ${err}`)
})

app.use((req, res, next)=>{
    return res.status(404).send({
        resp: '404',
        err: true,
        msg: `No se encontro esta url ${req.url}`,
        cont: 0
    })
})

server = app.listen(process.env.PORT, hostname, () =>{
    console.log(`Corriendo en http://${hostname}:${process.env.port}`)
})