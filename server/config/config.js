/* jshint esversion: 8 */
// Puerto
process.env.PORT = process.env.PORT || 3000;

// Entorno
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// Base de Datos
if (process.env.NODE_ENV === 'dev') {
    process.env.URLDB = "mongodb+srv://Admin:admin123@cluster0.i0pvv.mongodb.net/ProyectoFinal?retryWrites=true&w=majority";
} else {
    process.env.URLDB = "mongodb+srv://Admin:admin123@cluster0.i0pvv.mongodb.net/ProyectoFinal?retryWrites=true&w=majority";
}

// Declaración de array de middleweres a usar en las APIS
process.middleweres = []; //
